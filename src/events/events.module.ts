import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupRepository } from 'src/chat/repositories/group.repostory';
import { Group, GroupSchema } from 'src/chat/schemas/group.schema';
import { EmitterHandlersService } from './emitter-handlers.service';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }]),
  ],
  providers: [EventsGateway, EmitterHandlersService, GroupRepository],
})
export class EventsModule {}
