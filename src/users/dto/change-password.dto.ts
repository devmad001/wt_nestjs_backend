import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'Current',
    description: 'Current Password',
    required: true,
  })
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    example: 'New',
    description: 'New Password',
    required: true,
  })
  @IsNotEmpty()
  newPassword: string;
}
