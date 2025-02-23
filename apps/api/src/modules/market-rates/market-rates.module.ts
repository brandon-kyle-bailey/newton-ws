import { Logger, Module } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { MarketRatesService } from './market-rates.service';

@Module({
  imports: [],
  controllers: [],
  providers: [Logger, MarketRatesService, WebsocketGateway],
})
export class MarketRatesModule {}
