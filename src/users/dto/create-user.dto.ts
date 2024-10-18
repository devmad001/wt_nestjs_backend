import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { GetUser } from './get-users.dto';

export class CreateUserDto {
  @ApiProperty({
    example: 'Alice',
    description: 'Name',
    required: true,
  })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: 'user',
    description: 'Role',
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(GetUser)
  role: GetUser;

  @ApiProperty({
    example: '0987654321',
    description: 'Phone',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    example: 'hello@gmail.com',
    description: 'Email',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Agency',
    description: 'Agency',
    required: true,
  })
  @IsString()
  agency: string;

  @ApiProperty({
    example: 'Field Office',
    description: 'Field Office',
    required: true,
  })
  @IsString()
  fieldOffice: string;

  @ApiProperty({
    example: 'Squad',
    description: 'Squad',
    required: true,
  })
  @IsString()
  squad: string;
}
