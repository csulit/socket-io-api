import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('createMessage')
  async create(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const message = this.messagesService.create(createMessageDto, client.id);

    this.server.to(createMessageDto.room).emit('message', message);

    console.log(client.handshake.auth);

    return message;
  }

  @SubscribeMessage('findAllMessages')
  async findAll() {
    return this.messagesService.findAll();
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @MessageBody() data: { name: string; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(data.room);

    return this.messagesService.identify(data.name, client.id);
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody() data: { isTyping: boolean; room: string },
    @ConnectedSocket() client: Socket,
  ) {
    const name = this.messagesService.getClientName(client.id);

    // Send only to client and not to me.
    client.broadcast
      .to(data.room)
      .emit('typing', { name, isTyping: data.isTyping });
  }
}
