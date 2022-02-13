import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from './config';
import { DatabaseModule } from './database';

import { AccountsModule } from './modules/accounts';
import { UsersModule } from './modules/users';
import { AuthModule } from './modules/auth';

import { AppController } from './app.controller';
import { CategoriesModule } from './modules/categories';

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
    DatabaseModule,
    ConfigModule,
    AuthModule,
    UsersModule,
    AccountsModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
