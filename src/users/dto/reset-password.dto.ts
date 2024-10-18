import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: '12345678',
    description: 'Reset Password',
    required: true,
  })
  @IsNotEmpty()
  newPassword: string;
}
