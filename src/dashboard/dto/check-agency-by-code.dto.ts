import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class CheckAgencyByCodeDto {
  @ApiProperty({
    example: '65462f086e50bfee67b952f5',
    description: 'Activation Code',
    required: true,
  })
  @IsNotEmpty()
  @IsMongoId()
  code: string;
}
