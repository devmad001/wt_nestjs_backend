import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateSignalKeys } from './dto/update-signal-keys.dto';
import { UserGuard } from 'src/common/guards';
import { GetCurrentUserId } from 'src/common/decorators';
import { GetKeysDto } from './dto/get-keys.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('[Common] Users')
@ApiBearerAuth()
@UseGuards(UserGuard)
@Controller({
  path: 'users',
  version: '1.0',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('/changePassword')
  async changePassword(
    @GetCurrentUserId() userId: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return await this.usersService.changePassword(userId, dto);
  }

  @Put('/resetPassword')
  async resetPassword(
    @GetCurrentUserId() userId: string,
    @Body() dto: ResetPasswordDto,
  ) {
    return await this.usersService.resetPassword(userId, dto);
  }

  @Put('/signal')
  async updateSignalKeys(
    @GetCurrentUserId() userId: string,
    @Body() dto: UpdateSignalKeys,
  ) {
    return await this.usersService.updateSignalKeys(userId, dto);
  }

  @Post('/publicKeys')
  async getKeys(@GetCurrentUserId() userId: string, @Body() dto: GetKeysDto) {
    return await this.usersService.getPublicKeys(userId, dto);
  }

  @Post('/me')
  async getMe(@GetCurrentUserId() userId: string) {
    return await this.usersService.getMe(userId);
  }

  @Get('/paymentInfo')
  async getPaymentInfo(@GetCurrentUserId() userId: string) {
    return this.usersService.getPaymentInfo(userId);
  }
}
