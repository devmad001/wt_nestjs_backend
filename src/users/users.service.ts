import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserReviewStatus, UserRole } from './schemas/user.schema';
import { UserRepository } from './repository/user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateSignalKeys } from './dto/update-signal-keys.dto';
import { GetKeysDto } from './dto/get-keys.dto';
import { AgencyRepository } from 'src/agency/repositories/agency.repostory';
import { FieldOfficeRepository } from 'src/agency/repositories/field-office.repostory';
import { ChangePasswordDto } from './dto/change-password.dto';
import { StripeService } from 'src/stripe/stripe.service';
import { RegisteredUserType } from 'src/agency/schemas/agency.schema';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly agencyRepository: AgencyRepository,
    private readonly fieldOfficeRepository: FieldOfficeRepository,
    private readonly stripeService: StripeService,
  ) {}

  async create(
    createUserDto: any,
    role: string,
    memberships: string[],
    verificationCode: string,
    reviewStatus: UserReviewStatus,
  ): Promise<User> {
    createUserDto.password = await this.hashPassword(createUserDto.password);
    const createdUser = await this.userRepository.create({
      ...createUserDto,
      role,
      memberships,
      verificationCode,
      reviewStatus,
    });
    return createdUser;
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneByEmail(email);
  }

  async updateOne(userId: string, data: UpdateUserDto) {
    await this.userRepository.updateOne(userId, data);
    return true;
  }

  async updateSignalKeys(userId: string, data: UpdateSignalKeys) {
    await this.userRepository.updateOne(userId, {
      signalKeys: data,
    });
    return true;
  }

  async getPublicKeys(userId: string, dto: GetKeysDto) {
    return this.userRepository.findPublicKeys(dto.userIds);
  }

  async getMe(userId: string) {
    const user: any = await this.userRepository.findOneById(userId, true);
    user.agency = await this.agencyRepository.findOneById(user.agency);
    user.fieldOffice = await this.fieldOfficeRepository.findOneById(
      user.fieldOffice,
    );
    user.squad = await this.fieldOfficeRepository.findOneById(user.squad);
    return user;
  }

  async getPaymentInfo(userId: string) {
    const user: any = await this.userRepository.findOneById(userId, true);
    if (user.role === UserRole.SUPER_ADMIN) {
      user.paymentInfo.customer = await this.stripeService.getCustomer(
        user.paymentInfo.customerId,
      );
      user.paymentInfo.subscription =
        await this.stripeService.getCurrentSubscription(
          user.paymentInfo.customerId,
        );
      user.paymentInfo.paymentMethods =
        await this.stripeService.getPaymentMethods(user.paymentInfo.customerId);
    }
    return user;
  }

  async changePassword(userId: string, data: ChangePasswordDto) {
    if (data.currentPassword === data.newPassword) {
      throw new BadRequestException('Password unchanged.');
    }
    const user = await this.userRepository.findOneById(userId);
    const isMatchCurrentPass = await bcrypt.compare(
      data.currentPassword,
      user.password,
    );
    if (!isMatchCurrentPass) {
      throw new BadRequestException('An error occured when validating.');
    }
    await this.userRepository.updateOne(userId, {
      password: await this.hashPassword(data.newPassword),
    });
    return true;
  }

  async resetPassword(userId: string, data: ResetPasswordDto) {
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new BadRequestException('An error occured when validating.');
    }
    await this.userRepository.updateOne(userId, {
      password: await this.hashPassword(data.newPassword),
    });
    return true;
  }

  async triggerSetupStripePayment(userId: string) {
    const user = await this.userRepository.findOneById(userId, true);
    switch (user.role) {
      case UserRole.SUPER_ADMIN: {
        if (user.paymentInfo && user.paymentInfo.customerId) {
          return;
        }
        // Create Stripe Customer
        const customer = await this.stripeService.createCustomer(
          user.fullName,
          user.email,
          user.phone,
        );
        await this.userRepository.updateOne(user._id.toString(), {
          paymentInfo: { customerId: customer.id },
        });
        // Init Subscription
        await this.stripeService.createSubscription(customer.id);
        break;
      }
      case UserRole.ADMIN:
      case UserRole.USER: {
        // Check Redeem
        const agency = await this.agencyRepository.findOneById(
          user.agency.toString(),
        );
        const agencyOwner = await this.userRepository.findAgencyManager(
          agency._id.toString(),
        );
        const registeredUserId = agency.registeredUsers.find(
          (v) => v.user.toString() === user._id.toString(),
        );
        // Update Subscription
        if (!registeredUserId) {
          const customerId = agencyOwner.paymentInfo.customerId;
          await Promise.all([
            this.stripeService.updateSubscription(customerId, 1),
            this.agencyRepository.addRegisteredUser(
              agency._id,
              user._id,
              RegisteredUserType.CHARGE,
            ),
          ]);
        }
        break;
      }
    }
  }

  async findById(userId: string) {
    return this.userRepository.findOneById(userId);
  }

  async findByIdForAuth(userId: string) {
    return this.userRepository.findByIdForAuth(userId);
  }

  async hashPassword(data: string) {
    return bcrypt.hash(data, 10);
  }
}
