import { Get, Param, Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ExchangeRateService } from './exchangerate.service';
import { CurrencyBaseParamDto, CurrencyRateDto } from './dto';
import { CurrencyRateCacheRecord } from './types';

@ApiTags('exchangerate')
@Controller('exchangerate')
export class ExchangerateController {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  @Get()
  public async selectAll(): Promise<CurrencyRateDto[]> {
    return this.exchangeRateService.selectAllFromCache();
  }

  @Get('record')
  public async selectAllAsRecord(): Promise<CurrencyRateCacheRecord> {
    return this.exchangeRateService.selectAllFromCacheAsRecord();
  }

  @Get(':base')
  public async selectOne(@Param() conditions: CurrencyBaseParamDto): Promise<CurrencyRateDto> {
    return this.exchangeRateService.selectOneFromCache(conditions.base);
  }
}
