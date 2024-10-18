import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DataBaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { APP_GUARD, APP_INTERCEPTOR, RouterModule } from '@nestjs/core';
import { UserGuard } from './common/guards';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { ResponseWrapperInterceptor } from './common/inteceptors/response-wrapper.interceptor';
import { UserManagementModule } from './users/user-management.module';
import { DashboardManagementModule } from './dashboard/dashboard-management.module';
import { StatisticModule } from './dashboard/statistic.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    DataBaseModule,
    EventsModule,
  
    StatisticModule,
    AuthModule,

    UserManagementModule,
    UsersModule,
   
    DashboardManagementModule,
   
    RouterModule.register([
      {
        path: 'admin',
        module: DashboardManagementModule,
      },
      {
        path: 'admin',
        module: UserManagementModule,
      },
     
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: UserGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseWrapperInterceptor,
    },
  ],
})
export class AppModule {}
