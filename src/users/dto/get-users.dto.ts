import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { QueryPageDto } from 'src/common/dto/query-base.dto';
import { UserReviewStatus } from '../schemas/user.schema';

export enum GetUser {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
}

export class SortDto {
  @IsString()
  key: string;

  @IsString()
  type: string;
}

export class GetUsersDto extends QueryPageDto {
  @ApiProperty({
    example: 'user',
    description: 'super_admin/admin/user',
    required: false,
  })
  @IsOptional()
  @IsEnum(GetUser)
  role: GetUser;

  @ApiProperty({
    example: UserReviewStatus.ACCEPTED,
    description: 'accepted/in_progress',
    required: false,
  })
  @IsOptional()
  @IsEnum(UserReviewStatus)
  reviewStatus: UserReviewStatus;
}
