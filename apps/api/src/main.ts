/* eslint-disable @typescript-eslint/no-misused-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { simpleConfig } from 'lib/config/config';
import { MarketRatesService } from './modules/market-rates/services/market-rates.service';
// import { RedisIoAdapter } from './modules/market-rates/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();

  // NOTE: This can be uncommented to enable redis IO if you run a redis server using "npm run start:infrastructure" (if you have docker)
  // const redisIoAdapter = new RedisIoAdapter(app);
  // await redisIoAdapter.connectToRedis();
  // app.useWebSocketAdapter(redisIoAdapter);
  // app
  //   .getHttpAdapter()
  //   .getInstance()
  //   .on('close', async () => {
  //     await redisIoAdapter.disconnectRedis();
  //   });

  await app.listen(simpleConfig.ws.port);
  const service = app.get(MarketRatesService);
  setInterval(
    async () => await service.getMarketRates(),
    simpleConfig.ws.interval,
  );
}
void bootstrap();
