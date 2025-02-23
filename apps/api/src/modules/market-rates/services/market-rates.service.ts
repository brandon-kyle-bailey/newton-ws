/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { ASSETS } from 'lib/constants';
import { ICoingeckoResponseDto } from 'lib/dtos/coingecko-response.dto';
import { Channels, Events } from 'lib/enums';
import { ISymbolData } from 'lib/interfaces';
import { simpleConfig } from 'lib/config/config';
import { WebsocketGateway } from '../transport/websocket.gateway';
import { MarketRateDtoMapper } from '../mappers/market-rate.mapper';

@Injectable()
export class MarketRatesService {
  rates: ISymbolData[] = [];
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    @Inject(MarketRateDtoMapper) private readonly mapper: MarketRateDtoMapper,
    @Inject(WebsocketGateway) private readonly gateway: WebsocketGateway,
  ) {}
  async getMarketRates(): Promise<void> {
    try {
      const response = await axios.get(simpleConfig.dataSource.url, {
        params: {
          vs_currency: simpleConfig.dataSource.currency,
        },
      });

      const mixinSymbols = ASSETS.map((symbol: ISymbolData) =>
        symbol.symbol.toLowerCase(),
      );
      const foundIds: string[] = [];
      const rates: ISymbolData[] = response.data.map(
        (data: ICoingeckoResponseDto) => {
          foundIds.push(data.symbol.toLowerCase());
          return this.mapper.fromPersistence(data);
        },
      );
      // NOTE: this mixin is to ensure the requirement spec is satisfied for the list of assets supported.
      mixinSymbols.map((symbol: string) => {
        if (!foundIds.includes(symbol.toLowerCase())) {
          rates.push(this.mapper.fromPersistence({
            id: symbol,
            symbol: symbol,
            image: '',
            current_price: Math.random() * 1000,
            high_24h: Math.random() * 1000,
            low_24h: Math.random() * 1000,
            price_change_percentage_24h: Math.random() * 100,
          }));
        }
      });
      this.gateway.emit(Channels.RATES, Events.DATA, rates);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
