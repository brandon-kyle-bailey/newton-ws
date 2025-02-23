
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient, RedisClientType } from 'redis';
import { simpleConfig } from 'lib/config/config';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private pubClient: RedisClientType | undefined;
  private subClient: RedisClientType | undefined;
  async connectToRedis(): Promise<void> {
    this.pubClient = createClient({ url: `redis://${simpleConfig.redis.host}:${simpleConfig.redis.port}` });
    this.subClient = this.pubClient.duplicate();

    await Promise.all([this.pubClient.connect(), this.subClient.connect()]);

    this.adapterConstructor = createAdapter(this.pubClient, this.subClient);
  }
  async disconnectRedis(): Promise<void> {
    await Promise.all([this.pubClient?.disconnect(), this.subClient?.disconnect()]);
  }
  
  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
