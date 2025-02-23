/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Inject, Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { simpleConfig } from 'lib/config/config';
import { SubscribeActionDto } from 'lib/dtos';
import { UnsubscribeActionDto } from 'lib/dtos/unsubscribe-action.dto';
import { Events } from 'lib/enums';
import { createClient } from 'redis';
import { Server, Socket } from 'socket.io';


@WebSocketGateway({
  namespace: simpleConfig.ws.namespace,
  path: simpleConfig.ws.path,
  cors: simpleConfig.ws.cors,
})
export class WebsocketGateway {
  constructor(@Inject(Logger) private readonly logger: Logger) {

  }

  @WebSocketServer()
  server: Server | undefined;

  emit(channel: string, event: string, data: any): void {
    if (!this.server) {
      this.logger.error('Server not initialized');
      return;
    }
    this.server.to(channel).emit(event, data);
  }

  @SubscribeMessage(Events.SUBSCRIBE)
  async onSubscribe(client: Socket, data: SubscribeActionDto): Promise<void> {
    if (client.rooms.has(data.channel)) {
      this.logger.log('User already subscribed to channel');
      return;
    }
    await client.join(data.channel);
  }

  @SubscribeMessage(Events.UNSUBSCRIBE)
  async onUnsubscribe(
    client: Socket,
    data: UnsubscribeActionDto,
  ): Promise<void> {
    if (!client.rooms.has(data.channel)) {
      this.logger.log('User not subscribed to channel');
      return;
  }
  await client.leave(data.channel);
  }
}
