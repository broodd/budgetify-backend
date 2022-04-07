import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { ConfigService } from 'src/config';

import { UserEntity } from '../../users/entities';

import { JwtAccessTokenPayloadDto } from '../dto';
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
      secretOrKey: configService.get('JWT_SECRET_ACCESS_TOKEN'),
    });
  }

  /**
   * [description]
   * @param id
   */
  public async validate({ id, refreshTokenId }: JwtAccessTokenPayloadDto): Promise<UserEntity> {
    return this.authService.validateUser({ id, refreshTokens: { id: refreshTokenId } });
  }
}
