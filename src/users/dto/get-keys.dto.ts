import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class GetKeysDto {
  @ApiProperty({
    example: '["123","456"]',
    description: 'userIds',
  })
  @IsNotEmpty()
  @IsArray()
  userIds: string[];
}
