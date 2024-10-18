import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { GetUser } from 'src/cases/dto/get-documents.dto';

export class ManageUpdateUserDto {
  @ApiProperty({
    example: 'Alice',
    description: 'Name',
  })
  @IsOptional()
  @IsString()
  fullName: string;

  @ApiProperty({
    example: 'user',
    description: 'Role',
  })
  @IsOptional()
  @IsEnum(GetUser)
  role: GetUser;

  @ApiProperty({
    example: '0987654321',
    description: 'Phone',
  })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({
    example: 'hello@gmail.com',
    description: 'Email',
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'ID',
    description: 'ID of Agency',
  })
  @IsOptional()
  @IsMongoId()
  agency: string;

  @ApiProperty({
    example: 'ID',
    description: 'ID of Field Office',
  })
  @IsOptional()
  @IsMongoId()
  fieldOffice: string;

  @ApiProperty({
    example: 'ID',
    description: 'ID of Squad',
  })
  @IsOptional()
  @IsMongoId()
  squad: string;
}
