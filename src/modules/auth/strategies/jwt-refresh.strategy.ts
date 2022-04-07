import { BadRequestException, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { compare } from 'bcrypt';

import { ErrorTypeEnum } from 'src/common/enums';
import { ConfigService } from 'src/config';

import { UserEntity } from '../../users/entities';

import { JwtRefreshTokenPayloadDto } from '../dto';
import { AuthService } from '../auth.service';

/**
 * [description]
 */
@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
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
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: configService.get('JWT_SECRET_REFRESH_TOKEN'),
    });
  }

  /**
   * [description]
   * @param id
   */
  public async validate({
    id,
    ppid,
    refreshTokenId,
  }: JwtRefreshTokenPayloadDto): Promise<UserEntity> {
    const user = await this.authService.validateUser({ id, refreshTokens: { id: refreshTokenId } });
    const [refreshToken] = user.refreshTokens;
    if (!(await compare(ppid, refreshToken.ppid)))
      throw new BadRequestException(ErrorTypeEnum.AUTH_INCORRECT_CREDENTIALS);
    return user;
  }
}
