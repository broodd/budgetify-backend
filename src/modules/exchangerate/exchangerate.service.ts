import Axios, { AxiosInstance } from 'axios';
import { InjectQueue } from '@nestjs/bull';
import { Cache } from 'cache-manager';
import { Queue } from 'bull';
import {
  BadGatewayException,
  CACHE_MANAGER,
  OnModuleInit,
  Injectable,
  Inject,
  Logger,
} from '@nestjs/common';

import { CurrencyEnum, ErrorTypeEnum } from 'src/common/enums';

import {
  CurrencyRateApi,
  CurrencyRateCache,
  CurrencyRateConvert,
  CurrencyRateCacheRecord,
} from './types';
import { AXIOS_INSTANCE_TOKEN, EXCHANGERATE_QUEUE, EVERY_6TH_HOUR } from './constants';
import { ExchangeRateProcessorEnum } from './enums';
import { ConfigService } from 'src/config';

@Injectable()
export class ExchangeRateService implements OnModuleInit {
  private readonly logger = new Logger(ExchangeRateService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @Inject(AXIOS_INSTANCE_TOKEN)
    private readonly instance: AxiosInstance = Axios,
    @InjectQueue(EXCHANGERATE_QUEUE)
    private readonly exchangerateProcessor: Queue,
    public readonly configService: ConfigService,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.moduleInit().catch((error) => this.logger.error(error));
  }

  public async selectFromApiAndSaveToCache(): Promise<void> {
    const rates = await this.selectAllFromApi();
    await this.saveAllToCache(rates);
  }

  public async selectAllFromCache(): Promise<CurrencyRateCache[]> {
    const result: string[] = await this.cacheManager.store.mget(Object.values(CurrencyEnum));
    return result.map((data) => JSON.parse(data));
  }

  public async selectAllFromCacheAsRecord(): Promise<CurrencyRateCacheRecord> {
    const result: string[] = await this.cacheManager.store.mget(Object.values(CurrencyEnum));
    return result
      .map((data) => JSON.parse(data))
      .reduce<CurrencyRateCacheRecord>(
        (acc, current) => ((acc[current.base] = current.rates), acc),
        {},
      );
  }

  public async selectOneFromCache(base: CurrencyEnum): Promise<CurrencyRateCache> {
    const result: string = await this.cacheManager.store.get<CurrencyRateCache>(base).catch(() => {
      throw new BadGatewayException(ErrorTypeEnum.EXCHANGERATE_NOT_FOUND_FROM_CACHE);
    });
    return JSON.parse(result);
  }

  public async selectOneConvert({ base, currency, amount }: CurrencyRateConvert): Promise<number> {
    const { rates } = await this.selectOneFromCache(base);
    return rates[currency] * amount;
  }

  public async selectAllFromApi(): Promise<CurrencyRateApi[]> {
    const currencies = Object.values(CurrencyEnum);
    const promises = currencies.map((base) => {
      return this.instance.get<CurrencyRateApi>('https://api.exchangerate.host/latest', {
        params: { symbols: currencies.join(','), base },
      });
    });

    const response = await Promise.all(promises).catch(() => {
      throw new BadGatewayException(ErrorTypeEnum.EXCHANGERATE_NOT_FOUND_FROM_API);
    });

    return response.map((value) => value.data);
  }

  public async saveAllToCache(currencies: CurrencyRateApi[]): Promise<void> {
    const set = currencies.reduce<(CurrencyEnum | string)[]>(
      (acc, current) => (
        acc.push(current.base, JSON.stringify({ base: current.base, rates: current.rates })), acc
      ),
      [],
    );
    await this.cacheManager.store.mset<CurrencyRateCache>(...set);
  }

  public async moduleInit(): Promise<void> {
    await this.exchangerateProcessor.removeRepeatable(
      ExchangeRateProcessorEnum.UPDATE_CURRENCY_RATES,
      {
        cron: EVERY_6TH_HOUR,
        jobId: ExchangeRateProcessorEnum.UPDATE_CURRENCY_RATES,
      },
    );
    await this.exchangerateProcessor.add(
      ExchangeRateProcessorEnum.UPDATE_CURRENCY_RATES,
      {},
      {
        repeat: {
          cron: EVERY_6TH_HOUR,
        },
        jobId: ExchangeRateProcessorEnum.UPDATE_CURRENCY_RATES,
      },
    );

    const currencies = await this.selectAllFromCache();
    const isEmpty = currencies.some((value) => !value);
    if (isEmpty) await this.selectFromApiAndSaveToCache();
  }
}
