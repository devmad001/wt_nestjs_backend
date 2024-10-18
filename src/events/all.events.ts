export class GroupCreatedEvent {
  public static EVENT_NAME = 'group.created';

  _id: string;
  members: any[];
}

export class GroupUpdatedEvent {
  public static EVENT_NAME = 'group.updated';

  _id: string;
  members: any[];
}

export class NewMessageCreatedEvent {
  public static EVENT_NAME = 'message.created';

  _id: string;
  sender: any;
  group: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export class DocumentProcessedEvent {
  public static EVENT_NAME = 'document.processed';

  userId: string;
}

export class TollAwareRefreshEvent {
  public static EVENT_NAME = 'tollaware.refresh';

  userId: string;
  type: string;
  filterData: string;
}
