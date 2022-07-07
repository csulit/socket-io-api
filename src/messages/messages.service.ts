import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  private messages: Message[] = [];
  private clientToUser = {};

  identify(name: string, clientId: string) {
    this.clientToUser[clientId] = name;

    return Object.values(this.clientToUser);
  }

  create(createMessageDto: CreateMessageDto, clientId: string) {
    const message = {
      name: this.clientToUser[clientId],
      text: createMessageDto.text,
      room: createMessageDto.room,
    };

    this.messages.push(message);

    return message;
  }

  findAll() {
    return this.messages;
  }

  getClientName(clientId: string) {
    console.log(this.clientToUser);

    return this.clientToUser[clientId];
  }
}
