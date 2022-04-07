import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { ConfigService } from 'src/config';

import { UsersModule } from '../users';

import { JwtRefreshTokenStrategy, JwtStrategy } from './strategies';

import { CACHE_AUTH_PREFIX } from './auth.constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SendGridModule } from 'src/sendgrid';

/**
 * [description]
 */
@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) =>
        Object.assign(
          {
            store: redisStore,
            prefix: CACHE_AUTH_PREFIX,
            ttl: configService.get('CACHE_AUTH_TTL'),
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
    SendGridModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        apiKey: configService.get('SENDGRID_API_KEY'),
        default: {
          from: configService.get('SENDGRID_API_SENDER'),
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshTokenStrategy],
  exports: [PassportModule, JwtModule, AuthService],
})
export class AuthModule {}
