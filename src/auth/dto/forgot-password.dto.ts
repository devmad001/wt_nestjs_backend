import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'bisdevt@gmail.com',
    description: 'Email',
  })
  @IsEmail()
  email: string;
}
