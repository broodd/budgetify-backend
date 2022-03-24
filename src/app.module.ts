import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { BullModule } from '@nestjs/bull';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from './config';
import { DatabaseModule } from './database';

import { ExchangeRateModule } from './modules/exchangerate';
import { TransactionsModule } from './modules/transactions';
import { CategoriesModule } from './modules/categories';
import { AccountsModule } from './modules/accounts';
import { UsersModule } from './modules/users';
import { AuthModule } from './modules/auth';

import { AppController } from './app.controller';

/**
 * [description]
 */
@Module({
  imports: [
    TerminusModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get('THROTTLE_TTL'),
        limit: configService.get('THROTTLE_LIMIT'),
      }),
    }),
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_HAS_PASSWORD')
            ? configService.get('REDIS_PASSWORD')
            : undefined,
        },
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    ConfigModule,
    AuthModule,
    UsersModule,
    AccountsModule,
    CategoriesModule,
    TransactionsModule,
    ExchangeRateModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
