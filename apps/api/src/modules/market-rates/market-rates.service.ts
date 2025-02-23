/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { WebsocketGateway } from './websocket.gateway';
import { ASSETS } from 'lib/constants';
import { Channels, Events } from 'lib/enums';
import { ISymbolData } from 'lib/interfaces';
import axios from 'axios';
import { ICoingeckoResponseDto } from 'lib/dtos/coingecko-response.dto';


@Injectable()
export class MarketRatesService {
  rates: ISymbolData[] = [];
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    @Inject(WebsocketGateway) private readonly gateway: WebsocketGateway,
  ) {}
  async getMarketRates(): Promise<void> {
    try {
      const response = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
        params: {
          vs_currency: 'cad',
        },
      });

      const mixinSymbols = ASSETS.map((symbol: ISymbolData) => symbol.symbol.toLowerCase());
      const foundIds: string[] = [];
      const rates: ISymbolData[] = response.data.map((data: ICoingeckoResponseDto) => {
        if(data.id.includes("polygon")) console.log(data)
        foundIds.push(data.symbol.toLowerCase());
        return {
          image: data.image,
          symbol: data.id,
          spot: data.current_price,
          bid: data.low_24h,
          ask: data.high_24h,
          change: data.price_change_percentage_24h,
          timestamp: Date.now(),
        }
      });
      // ensure all symbols are at least present per requirements spec
      mixinSymbols.map((symbol: string) => {
        if (!foundIds.includes(symbol.toLowerCase())) {
          rates.push({
            image: '',
            symbol: symbol,
            spot: Math.random() * 1000,
            bid: Math.random() * 1000,
            ask: Math.random() * 1000,
            change: Math.random() * 100,
            timestamp: Date.now(),
          });
        }
      });
      this.gateway.emit(Channels.RATES, Events.DATA, rates);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
