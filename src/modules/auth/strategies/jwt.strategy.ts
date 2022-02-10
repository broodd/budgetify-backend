import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { ConfigService } from 'src/config';

import { UserEntity } from '../../users/entities';

import { AuthService } from '../auth.service';

/**
 * [description]
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * [description]
   * @param configService
   * @param authService
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('PASSPORT_SECRET'),
    });
  }

  /**
   * [description]
   * @param id
   */
  public async validate({ id }: UserEntity): Promise<UserEntity> {
    return this.authService.validateUser({ id });
  }
}
