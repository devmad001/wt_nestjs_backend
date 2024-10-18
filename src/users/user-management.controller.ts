import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserGuard } from 'src/common/guards';
import { GetCurrentUser } from 'src/common/decorators';
import { UserManagementService } from './user-management.service';
import { GetUsersDto } from './dto/get-users.dto';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { ManageUpdateUserDto } from './dto/manage-update-user.dto';
import { GetUserIpAddress } from 'src/common/decorators/get-user-ip-address.decorator';

@ApiTags('[Admin] User Management')
@ApiBearerAuth()
@UseGuards(UserGuard)
@Controller({
  path: 'users',
  version: '1.0',
})
export class UserManagementController {
  constructor(private readonly userManagementService: UserManagementService) {}

  @Get('/')
  async getUsers(
    @GetUserIpAddress() ipAddress: string,
    @GetCurrentUser() user: User,
    @Query() dto: GetUsersDto,
  ) {
    return await this.userManagementService.getUsers(ipAddress, user, dto);
  }

  @Get('/agency')
  async loadAgency(@GetCurrentUser() user: User) {
    return await this.userManagementService.getAgencyForUser(user);
  }

  @Post('/')
  async createUser(
    @GetCurrentUser() authUser: User,
    @Body() dto: CreateUserDto,
  ) {
    return await this.userManagementService.createUser(authUser, dto);
  }

  @Get('/:id')
  async getUser(@GetCurrentUser() authUser: User, @Param('id') userId: string) {
    return await this.userManagementService.getUser(authUser, userId);
  }

  @Put('/:id/accept')
  async approve(@GetCurrentUser() authUser: User, @Param('id') userId: string) {
    return await this.userManagementService.accept(authUser, userId);
  }

  @Put('/:id/reject')
  async reject(@GetCurrentUser() authUser: User, @Param('id') userId: string) {
    return await this.userManagementService.reject(authUser, userId);
  }

  @Put('/:id')
  async updateUser(
    @GetCurrentUser() authUser: User,
    @Param('id') userId: string,
    @Body() dto: ManageUpdateUserDto,
  ) {
    return await this.userManagementService.updateUser(authUser, userId, dto);
  }
}
