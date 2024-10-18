import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from './../users/users.module';
import { RefreshTokenStrategy, AccessTokenStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { AgencyManagementModule } from './../agency/agency-management.module';

@Module({
  imports: [JwtModule.register({}), UsersModule, AgencyManagementModule],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
