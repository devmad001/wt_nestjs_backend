import { JwtService } from '@nestjs/jwt';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventType } from './events.type';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  jwtService = new JwtService();

  connectedUsers = new Map<string, Socket[]>();

  handleConnection(client: Socket) {
    const { token } = client.handshake.auth;
    if (!token) {
      client.emit('auth.failed', { message: 'Please provide token' });
      client.disconnect();
    } else {
      try {
        const data = this.jwtService.verify(token, { secret: 'at-secret' });
        this.addConnectedClient(data.sub, client);
        console.log(`User ${data.sub} connected`);
        client.join(data.sub);
      } catch (e) {
        client.emit('auth.failed', { message: 'Invalid Token.' });
        console.log('Error when authorize socket connection');
      }
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`User disconnected with id ${client.id}`);
  }

  sendMessageToUser(userId: string, eventType: EventType, data: any) {
    const clients: Socket[] = this.getConnectedClients(userId);
    clients.forEach((client) => {
      client.emit(eventType, data);
    });
  }

  // Group Chat

  @SubscribeMessage(EventType.ROOM_JOIN)
  handleJoinRoom(client: Socket, roomId: string): void {
    client.join(roomId);
    client.emit(EventType.ROOM_JOIN, `You've joined the room: ${roomId}`);
  }

  @SubscribeMessage(EventType.MESSAGE_TYPING)
  handleTypingMessage(client: Socket, receivedEvent: any): void {
    const { token } = client.handshake.auth;
    const data = this.jwtService.verify(token, { secret: 'at-secret' });
    this.sendMessageToRoom(receivedEvent.groupId, EventType.MESSAGE_TYPING, {
      groupId: receivedEvent.groupId,
      memberId: data.sub,
      isTyping: receivedEvent.isTyping,
    });
  }

  sendMessageToRoom(groupId: string, eventType: EventType, data: any): boolean {
    return this.server.to(groupId).emit(eventType, { data });
  }

  // private zone

  addConnectedClient(userId: string, client: Socket) {
    if (this.connectedUsers.has(userId)) {
      const currentClients = this.connectedUsers.get(userId);
      this.connectedUsers.set(userId, currentClients.concat(client));
    } else {
      this.connectedUsers.set(userId, [client]);
    }
  }

  getConnectedClients(userId: string): Socket[] {
    return this.connectedUsers.get(userId);
  }
}
