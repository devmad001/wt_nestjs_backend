import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/chat/schemas/message.schema';
import { File, FileSchema } from 'src/cases/schemas/file.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { StatisticRepository } from './repositories/statistic.repository';
import { UserView, UserViewSchema } from './schemas/userview.schema';
import { UserViewing, UserViewingSchema } from './schemas/userviewing.schema';
import { StatisticService } from './statistic.service';

@Global()
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
      {
        name: UserView.name,
        schema: UserViewSchema,
      },
      {
        name: UserViewing.name,
        schema: UserViewingSchema,
      },
    ]),
  ],
  exports: [StatisticService, StatisticService],
  providers: [StatisticRepository, StatisticService],
  controllers: [],
})
export class StatisticModule {}
