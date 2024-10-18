import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/chat/schemas/message.schema';
import { File, FileSchema } from 'src/cases/schemas/file.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { DashboardManagementController } from './dashboard-management.controller';
import { DashboardManagementService } from './dashboard-management.service';
import { DashboardRepository } from './repositories/dashboard.repostory';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: File.name,
        schema: FileSchema,
      },
      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),
  ],
  exports: [DashboardManagementService, DashboardRepository],
  providers: [DashboardManagementService, DashboardRepository],
  controllers: [DashboardManagementController],
})
export class DashboardManagementModule {}
