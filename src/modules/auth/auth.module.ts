import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

import { ConfigService } from 'src/config';

import { UsersModule } from '../users';

import { JwtStrategy } from './strategies';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

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
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, JwtModule, AuthService],
})
export class AuthModule {}
