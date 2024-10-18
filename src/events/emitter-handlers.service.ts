import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GroupRepository } from 'src/chat/repositories/group.repostory';
import { EventsGateway } from 'src/events/events.gateway';
import { EventType } from 'src/events/events.type';
import {
  DocumentProcessedEvent,
  GroupCreatedEvent,
  GroupUpdatedEvent,
  NewMessageCreatedEvent,
  TollAwareRefreshEvent,
} from './all.events';

@Injectable()
export class EmitterHandlersService {
  constructor(
    private readonly eventsGateway: EventsGateway,
    private readonly groupRepository: GroupRepository,
  ) {}

  @OnEvent(NewMessageCreatedEvent.EVENT_NAME, { async: true })
  async handleNewMessageCreatedEvent(message: NewMessageCreatedEvent) {
    await this.groupRepository.updateOne(message.group, {
      lastMessage: {
        senderId: message.sender._id,
        senderFullName: message.sender.fullName,
        content: message.content,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      },
    });

    // Notify Users Own Room: Last Message
    const group = await this.groupRepository.findOneById(message.group);
    group.members.forEach((member) => {
      this.eventsGateway.sendMessageToRoom(
        member._id.toString(),
        EventType.GROUP_UPDATED,
        group,
      );
    });

    // Notify Chat Group: Last Message
    this.eventsGateway.sendMessageToRoom(
      message.group.toString(),
      EventType.MESSAGE_CREATED,
      message,
    );
  }

  @OnEvent(GroupCreatedEvent.EVENT_NAME, { async: true })
  async handleGroupCreatedEvent(group: GroupCreatedEvent) {
    group.members.forEach((member) => {
      this.eventsGateway.sendMessageToRoom(
        member._id.toString(),
        EventType.GROUP_CREATED,
        group,
      );
    });
  }

  @OnEvent(GroupUpdatedEvent.EVENT_NAME, { async: true })
  async handleGroupUpdatedEvent(group: GroupUpdatedEvent) {
    this.eventsGateway.sendMessageToRoom(
      group._id.toString(),
      EventType.GROUP_UPDATED,
      group,
    );
  }

  @OnEvent(DocumentProcessedEvent.EVENT_NAME, { async: true })
  async handleDocumentProcessedEvent(data: DocumentProcessedEvent) {
    this.eventsGateway.sendMessageToUser(
      data.userId,
      EventType.PROCESS_DETECT,
      data,
    );
  }

  @OnEvent(TollAwareRefreshEvent.EVENT_NAME, { async: true })
  async handleTollAwareRefreshEvent(data: TollAwareRefreshEvent) {
    this.eventsGateway.sendMessageToUser(
      data.userId,
      EventType.TOLLAWARE_REFRESH,
      data,
    );
  }
}
