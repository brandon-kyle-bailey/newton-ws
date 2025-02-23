import { Logger, Module } from '@nestjs/common';
import { MarketRatesModule } from './modules/market-rates/market-rates.module';

@Module({
  imports: [MarketRatesModule],
  controllers: [],
  providers: [Logger],
})
export class AppModule {}
