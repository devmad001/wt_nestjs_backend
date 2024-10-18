import * as bcrypt from 'bcrypt';
import { v4 as Uuidv4 } from 'uuid';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AgencyRepository } from 'src/agency/repositories/agency.repostory';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUser, GetUsersDto } from './dto/get-users.dto';
import { ManageUpdateUserDto } from './dto/manage-update-user.dto';
import { UserRepository } from './repository/user.repository';
import { User, UserReviewStatus, UserRole } from './schemas/user.schema';
import { MailerService } from 'src/mailer/mailer.service';
import { Page } from 'src/dashboard/schemas/userview.schema';
import { StatisticService } from 'src/dashboard/statistic.service';

@Injectable()
export class UserManagementService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly agencyRepository: AgencyRepository,
    private readonly statisticService: StatisticService,
    private readonly mailerService: MailerService,
  ) {}

  async getUsers(
    ipAddress: string,
    user: User,
    dto: GetUsersDto,
  ): Promise<any> {
    if (user.role === UserRole.USER) {
      throw new BadRequestException('Need permission.');
    }
    if (user.role === UserRole.ADMIN && dto.role === GetUser.SUPER_ADMIN) {
      throw new BadRequestException('Need Super Admin permission.');
    }
    let userAgency;
    if (user.role !== UserRole.TECHOWNER) {
      userAgency = await this.agencyRepository.findOneById(
        user.agency.toString(),
      );
    }
    const usersData = await this.userRepository.findAll(
      dto.role,
      userAgency && userAgency._id,
      {
        key: dto.key,
      },
      dto.page,
      dto.limit,
      true,
      [user._id.toString()],
    );
    this.statisticService.createStatistic(
      user,
      Page.USER_MANAGEMENT,
      ipAddress,
    );
    return usersData.toPaginationObject();
  }

  async getUser(authUser: User, userId: string) {
    return this.userRepository.findOneById(userId, true, true);
  }

  async getAgencyForUser(user: User) {
    if (user.role === UserRole.TECHOWNER) {
      return this.agencyRepository.findManyByName();
    }
    const agency = user.agency;
    return this.agencyRepository.findOneById(agency.toString());
  }

  async createUser(authUser: User, dto: CreateUserDto): Promise<any> {
    this.cleanUserDto(dto);
    if (
      (authUser.role === UserRole.USER &&
        [GetUser.ADMIN, GetUser.SUPER_ADMIN].includes(dto.role)) ||
      (authUser.role === UserRole.ADMIN &&
        [GetUser.SUPER_ADMIN].includes(dto.role))
    ) {
      throw new BadRequestException('Need permission to perform');
    }
    const existed = await this.userRepository.findOneByEmail(dto.email);
    if (existed) {
      throw new BadRequestException('Email existed');
    }
    if (dto.role === GetUser.SUPER_ADMIN) {
      const superadminOwnAgency = await this.userRepository.findAgencyManager(
        dto.agency,
      );
      if (superadminOwnAgency) {
        throw new BadRequestException(
          'This agency is under managed by a Superadmin',
        );
      }
    }
    const verificationCode = Uuidv4();
    const userPassword = Uuidv4().substring(0, 6);
    const createdUser = await this.userRepository.create({
      ...dto,
      verificationCode,
      password: await this.hashPassword(userPassword),
      reviewStatus: UserReviewStatus.IN_PROGRESS,
    });
    this.mailerService.triggerConfirmationMail(
      createdUser._id.toString(),
      createdUser.email,
      verificationCode,
      createdUser.fullName,
      userPassword,
    );
    return createdUser;
  }

  async updateUser(
    authUser: User,
    userId: string,
    dto: ManageUpdateUserDto,
  ): Promise<any> {
    this.cleanUserDto(dto);
    const existedUser = await this.userRepository.findOneById(userId);
    if (!existedUser) {
      throw new NotFoundException('User not found.');
    }
    if (dto.email) {
      const sameEmailUser = await this.userRepository.findOneByEmail(dto.email);
      if (
        sameEmailUser &&
        sameEmailUser._id.toString() !== existedUser._id.toString()
      ) {
        throw new BadRequestException('New email already in used.');
      }
    }
    await this.userRepository.updateOne(userId, dto);
    return true;
  }

  async accept(authUser: User, userId: string): Promise<any> {
    const existedUser = await this.userRepository.findOneById(userId);
    if (!existedUser) {
      throw new NotFoundException('User not found.');
    }
    if (
      existedUser.role === UserRole.USER &&
      ![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(authUser.role)
    ) {
      throw new BadRequestException('Need permission to perform this action.');
    }
    if (
      existedUser.role === UserRole.ADMIN &&
      authUser.role !== UserRole.SUPER_ADMIN
    ) {
      throw new BadRequestException('Need superadmin approve this user');
    }
    if (
      existedUser.role === UserRole.SUPER_ADMIN &&
      authUser.role !== UserRole.TECHOWNER
    ) {
      throw new BadRequestException('Need techowner approve this user');
    }
    await this.userRepository.updateOne(userId, {
      reviewStatus: UserReviewStatus.ACCEPTED,
    });
    return true;
  }

  async reject(authUser: User, userId: string): Promise<any> {
    const existedUser = await this.userRepository.findOneById(userId);
    if (!existedUser) {
      throw new NotFoundException('User not found.');
    }
    await this.userRepository.updateOne(userId, {
      reviewStatus: UserReviewStatus.REJECTED,
    });
    return true;
  }

  async hashPassword(data: string) {
    return bcrypt.hash(data, 10);
  }

  private cleanUserDto(dto: CreateUserDto) {
    if (!dto.squad) delete dto.squad;
    if (!dto.fieldOffice) delete dto.fieldOffice;
    if (!dto.agency) delete dto.agency;
  }
}
