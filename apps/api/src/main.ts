import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { simpleConfig } from 'lib/config/config';
import { MarketRatesService } from './modules/market-rates/market-rates.service';
import { RedisIoAdapter } from './modules/market-rates/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);
  app.enableShutdownHooks();
  app.getHttpAdapter().getInstance().on('close', async () => {
    await redisIoAdapter.disconnectRedis();
  });
  
  await app.listen(simpleConfig.ws.port);
  const service = app.get(MarketRatesService);
  setInterval(async () => await service.getMarketRates(), simpleConfig.ws.interval);
}
void bootstrap();
