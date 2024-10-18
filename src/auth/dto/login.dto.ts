import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty() 
  @MinLength(6) 
  username: string;

   
  @IsNotEmpty()
  @MaxLength(20)
  @MinLength(6)
  password: string;
}
