import { Logger, Module } from '@nestjs/common';
import { WebsocketGateway } from './transport/websocket.gateway';
import { MarketRatesService } from './services/market-rates.service';
import { MarketRateDtoMapper } from './mappers/market-rate.mapper';

@Module({
  imports: [],
  controllers: [],
  providers: [Logger, MarketRateDtoMapper, MarketRatesService, WebsocketGateway],
})
export class MarketRatesModule {}
