import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import Axios from 'axios';

import { ConfigService } from 'src/config';

import {
  AXIOS_INSTANCE_TOKEN,
  CACHE_EXCHANGERATE_PREFIX,
  EXCHANGERATE_PROCESSOR,
  EXCHANGERATE_QUEUE,
} from './constants';
import { ExchangerateController } from './exchangerate.controller';
import { ExchangeRateProcessor } from './exchangerate.processor';
import { ExchangeRateService } from './exchangerate.service';

export const ExchangeRateQueueModule = BullModule.registerQueue({
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: true,
  },
  name: EXCHANGERATE_QUEUE,
});

const configService = new ConfigService();
class MockExchangeRateProcessor {}

@Module({
  imports: [
    ExchangeRateQueueModule,
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) =>
        Object.assign(
          {
            store: redisStore,
            prefix: CACHE_EXCHANGERATE_PREFIX,
            ttl: configService.get('CACHE_EXCHANGERATE_TTL'),
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
          configService.get('REDIS_HAS_PASSWORD') && {
            auth_pass: configService.get('REDIS_PASSWORD'),
          },
          configService.get('REDIS_TLS') && {
            tls: {
              rejectUnauthorized: false,
            },
          },
        ),
      inject: [ConfigService],
    }),
  ],
  controllers: [ExchangerateController],
  providers: [
    ExchangeRateService,
    {
      provide: AXIOS_INSTANCE_TOKEN,
      useValue: Axios,
    },
    {
      provide: EXCHANGERATE_PROCESSOR,
      useClass:
        configService.get<boolean>('IS_HEROKU_WORKER') === true
          ? ExchangeRateProcessor
          : MockExchangeRateProcessor,
    },
  ],
  exports: [ExchangeRateService],
})
export class ExchangeRateModule {}
