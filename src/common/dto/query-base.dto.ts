import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class QueryPageDto {
  @ApiProperty({
    example: '',
    description: 'Search key',
    required: false,
  })
  @IsOptional()
  @IsString()
  key?: string;

  @ApiProperty({
    example: 1,
    description: 'Page Number',
    required: false,
  })
  @Transform((d: any) => parseInt(d.value), { toClassOnly: true })
  @IsOptional()
  @IsInt()
  page?: number;

  @ApiProperty({
    example: 10,
    description: 'Page Limit',
    required: false,
  })
  @Transform((d: any) => parseInt(d.value), { toClassOnly: true })
  @IsOptional()
  @IsInt()
  limit: number;
}
