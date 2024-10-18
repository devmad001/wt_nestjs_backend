
import { IsNumber, IsString } from 'class-validator';

export class ExternalAuthDto {
  
  @IsString()
  fin_session_id: string;

  @IsNumber()
  expiry: number;
}
