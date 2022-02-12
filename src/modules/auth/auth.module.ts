import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { ConfigService } from 'src/config';

import { UsersModule } from '../users';

import { JwtStrategy } from './strategies';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SendGridModule } from 'src/sendgrid';

/**
 * [description]
 */
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const expiresIn = configService.get<number>('PASSPORT_EXPIRES');
        return {
          secret: configService.get('PASSPORT_SECRET'),
          signOptions: Object.assign({}, expiresIn && { expiresIn }),
        };
      },
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) =>
        Object.assign(
          {
            store: redisStore,
            prefix: 'RESET_PASSWORD:',
            ttl: configService.get('CACHE_RESET_PASSWORD_TTL'),
            host: configService.get('REDIS_HOST'),
            port: configService.get('REDIS_PORT'),
          },
          configService.get('REDIS_TLS') && {
            auth_pass: configService.get('REDIS_PASSWORD'),
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
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, JwtModule, AuthService],
})
export class AuthModule {}
