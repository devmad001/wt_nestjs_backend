import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginOtpDto {
  @ApiProperty({
    example: 'ID',
    description: 'ID Token',
  })
  @IsNotEmpty()
  idToken: string;

  @ApiProperty({
    description: 'OTP',
    example: '123456',
  })
  @IsNotEmpty()
  @MaxLength(6)
  @MinLength(6)
  otp: string;
}
