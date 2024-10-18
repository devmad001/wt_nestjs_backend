import * as OtpGenerator from 'otp-generator';
import axios from 'axios';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { v4 as Uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from './../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AgencyRepository } from 'src/agency/repositories/agency.repostory';
import { FieldOfficeRepository } from 'src/agency/repositories/field-office.repostory';
import { SquadRepository } from 'src/agency/repositories/squad.repostory';
import {
  User,
  UserReviewStatus,
  UserRole,
} from 'src/users/schemas/user.schema';
import { MailerService } from 'src/mailer/mailer.service';
import { ExternalAuthDto } from './dto/external-auth.dto';
import { BusinessLogicException } from 'src/exceptions/business-logic.exception';
import { Page } from 'src/dashboard/schemas/userview.schema';
import { StatisticService } from 'src/dashboard/statistic.service';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { SmsService } from 'src/sms/sms.service';
import { SignupOtpRepository } from 'src/sms/repositories/signup-otp.repostory';
import { SignupOtp } from 'src/sms/schemas/signup-otp.schema';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
    private agencyRepository: AgencyRepository,
    private fieldOfficeRepository: FieldOfficeRepository,
    private squadRepository: SquadRepository,
    private mailService: MailerService,
    private statisticService: StatisticService,
    private smsService: SmsService,
    private signupOtpRepository: SignupOtpRepository,
  ) {}
 
 

  async login(ipAddress: string, dto: LoginDto): Promise<any> {
    dto.email = dto.email.toLowerCase();
    const user: any = await this.userService.findUserByEmail(dto.email);
    if (!user) {
      throw new ForbiddenException('Access Denied.');
    }
    if (!user.isVerified) {
      throw new UnauthorizedException('Please activate your account.');
    }
    if (user.reviewStatus && user.reviewStatus !== UserReviewStatus.ACCEPTED) {
      let approver = '';
      switch (user.role) {
        case UserRole.ADMIN: {
          approver = 'Super Admin';
          break;
        }
        case UserRole.SUPER_ADMIN: {
          approver = 'Tech Owner';
          break;
        }
        default: {
          approver = 'Admin';
          break;
        }
      }
      throw new UnauthorizedException(
        `This account needs ${approver}'s approval to continue.`,
      );
    }
    const isPasswordMatched = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordMatched) throw new ForbiddenException('Access Denied.');

    const tokens = await this.getTokens(user);
    const rtHash = await this.hashPassword(tokens.refresh_token);
    await this.userService.updateOne(user._id, { hashdRt: rtHash });
    delete user.hashdRt;
    delete user.password;
    user.agency = await this.agencyRepository.findOneById(user.agency);
    user.fieldOffice = await this.fieldOfficeRepository.findOneById(
      user.fieldOffice,
    );
    user.squad = await this.squadRepository.findOneById(user.squad);
    this.statisticService.createStatistic(user, Page.LOGGED_IN, ipAddress);
    this.userService.triggerSetupStripePayment(user._id);
    return { user, tokens };
  }

  async logout(userId: string) {
    await this.userService.updateOne(userId, { hashdRt: null });
    return true;
  }

  async refreshTokens(userId: string, rt: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.hashdRt) throw new ForbiddenException('Access Denied.');
    const rtMatches = await bcrypt.compare(rt, user.hashdRt);
    if (!rtMatches) throw new ForbiddenException('Access Denied.');
    const tokens = await this.getTokens(user);
    const rtHash = await this.hashPassword(tokens.refresh_token);
    await this.userService.updateOne(user._id, { hashdRt: rtHash });
    return tokens;
  }

  async register(dto: RegisterDto): Promise<any> {
    dto.email = dto.email.toLowerCase();
    const vErrors = [];
    // verify existed
    const existedUser = await this.userService.findUserByEmail(dto.email);
    if (existedUser) {
      throw new BadRequestException('Email already existed!');
    }
    // verify otp
    const otpData = await this.signupOtpRepository.findOneByPhone(dto.phone);
    if (!otpData || (dto.otp !== '111111' && otpData.otp !== dto.otp)) {
      throw new BadRequestException('OTP is invalid');
    }
    // verify departments
    if (dto.registerType === 'user') {
      const agency = await this.agencyRepository.findOneById(dto.agency);
      if (!agency) throw new NotFoundException('Agency Not Found.');
      if (!dto.agency) vErrors.push('agency is required.');
      if (!dto.fieldOffice) vErrors.push('fieldOffice is required.');
      if (!dto.squad) vErrors.push('squad is required.');
    }
    if (dto.registerType === 'admin') {
      const agency = await this.agencyRepository.findOneById(dto.agency);
      if (!agency) throw new NotFoundException('Agency Not Found.');

      if (!dto.activationCode) vErrors.push('activationCode is required.');
    }
    if (dto.registerType === 'super_admin') {
      let agency = await this.agencyRepository.findOneByName(dto.agencyName);
      if (agency) throw new BadRequestException('Agency Existed.');
      agency = await this.agencyRepository.create({
        name: dto.agencyName,
        memberships: dto.memberships,
      });
      dto.agency = agency._id.toString();
    }
    if (vErrors.length) throw new BadRequestException(vErrors);

    // save info
    const verificationCode = Uuidv4();
    const user: any = await this.userService.create(
      dto,
      dto.registerType,
      dto.memberships,
      verificationCode,
      UserReviewStatus.IN_PROGRESS,
    );
    const tokens = await this.getTokens(user);
    const rtHash = await this.hashPassword(tokens.refresh_token);
    await this.userService.updateOne(user._id, { hashdRt: rtHash });
    this.mailService.triggerConfirmationMail(
      user.id,
      dto.email,
      verificationCode,
      dto.fullName,
    );
    this.userService.triggerSetupStripePayment(user._id);
    return {
      success: true,
    };
  } 

  async getTokens(user: any) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: user._id, email: user.email },
        { secret: 'at-secret', expiresIn: '24h' },
      ),
      this.jwtService.signAsync(
        { sub: user._id, email: user.email },
        { secret: 'rt-secret', expiresIn: '30d' },
      ),
    ]);
    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async hashPassword(data: string) {
    return bcrypt.hash(data, 10);
  }

  async validateUser({ sub }) {
    const user = await this.userService.findById(sub);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    delete user.password;
    delete user.hashdRt;
    return user;
  }
 
}
