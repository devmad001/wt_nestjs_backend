import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export enum RegisterType {
  SUPERADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
}

export class RegisterDto {
  @ApiProperty({
    example: 'user',
    description: 'Register Type',
    enum: RegisterType,
  })
  @IsString()
  @IsEnum(RegisterType)
  registerType: RegisterType;

  @ApiProperty({
    example: `["fin_aware","tracker_tool"]`,
    description: 'Tool Type',
  })
  @IsOptional()
  @IsArray()
  memberships: string[];

  @ApiProperty({
    example: '652981b4565f87045337cf7a',
    description: 'Activation Code',
  })
  @IsOptional()
  @IsString()
  activationCode: string;

  @ApiProperty({
    example: 'hello@gmail.com',
    description: 'Email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password',
    example: '123456',
  })
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'ID of Agency',
    example: 'ID',
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  agency: string;

  @ApiProperty({
    description: 'Name of Agency',
    example: 'FBI',
  })
  @IsOptional()
  @IsString()
  agencyName: string;

  @ApiProperty({
    description: 'Field Office',
    example: 'Los Angeles',
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  fieldOffice: string;

  @ApiProperty({
    description: 'Squad',
    example: 'Financial Crime',
  })
  @IsOptional()
  @IsString()
  @IsMongoId()
  squad: string;

  @ApiProperty({
    description: 'Full name',
    example: 'Alice',
  })
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Phone',
    example: '+84987654321',
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  phone: string;

  @ApiProperty({
    description: 'OTP',
    example: '123456',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  otp: string;
}
