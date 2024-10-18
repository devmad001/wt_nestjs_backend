import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/common/decorators';
import { GetUserIpAddress } from 'src/common/decorators/get-user-ip-address.decorator';
import { UserGuard } from 'src/common/guards';
import { User } from 'src/users/schemas/user.schema';
import { DashboardManagementService } from './dashboard-management.service';
import { GetViewingUsersDto } from './dto/get-viewing-users.dto';

@ApiTags('[Admin] Dashboard')
@ApiBearerAuth()
@UseGuards(UserGuard)
@Controller({
  path: 'dashboard',
  version: '1.0',
})
export class DashboardManagementController {
  constructor(private dashboardManagementService: DashboardManagementService) {}

  @Get('/onlineStatistic')
  @HttpCode(HttpStatus.OK)
  async getOnlineSummaray(
    @GetUserIpAddress() ip: string,
    @GetCurrentUser() user: User,
  ) {
    return await this.dashboardManagementService.getOnlineStatistic(ip, user);
  }

  @Get('/onlineUsers')
  @HttpCode(HttpStatus.OK)
  async getOnlineUsers(@Query() dto: GetViewingUsersDto) {
    return await this.dashboardManagementService.getOnlineUsers(dto);
  }

  @Get('/pageViews')
  @HttpCode(HttpStatus.OK)
  async getPageViews() {
    return await this.dashboardManagementService.getPageViews();
  }

  @Get('/messageSent')
  @HttpCode(HttpStatus.OK)
  async getMessageSent() {
    return await this.dashboardManagementService.getMessageSent();
  }

  @Get('/filesUploaded')
  @HttpCode(HttpStatus.OK)
  async getFilesUploaded() {
    return await this.dashboardManagementService.getFilesUploaded();
  }
}
