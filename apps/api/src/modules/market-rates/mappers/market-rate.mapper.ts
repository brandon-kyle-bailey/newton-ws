import { Injectable } from "@nestjs/common";
import { ICoingeckoResponseDto } from "lib/dtos/coingecko-response.dto";
import { ISymbolData } from "lib/interfaces";

@Injectable()
export class MarketRateDtoMapper {
    constructor() {}
    fromPersistence(persistence: ICoingeckoResponseDto): ISymbolData {
        return {
            image: persistence.image,
            symbol: persistence.id,
            spot: persistence.current_price,
            bid: persistence.low_24h,
            ask: persistence.high_24h,
            change: persistence.price_change_percentage_24h,
            timestamp: Date.now(),
        }
    }
}