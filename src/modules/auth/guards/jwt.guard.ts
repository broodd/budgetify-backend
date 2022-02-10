import { AuthGuard } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { ErrorTypeEnum } from 'src/common/enums';

import { UserEntity } from '../../users/entities';

/**
 * [description]
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * [description]
   * @param reflector
   */
  constructor() {
    super();
  }

  /**
   * [description]
   * @param err
   * @param user
   * @param info
   * @param ctx
   */
  public handleRequest(err: Error, user: UserEntity, info: Error): UserEntity | any {
    if (info) throw new UnauthorizedException(ErrorTypeEnum.AUTH_INVALID_TOKEN);
    if (!user) throw new UnauthorizedException(ErrorTypeEnum.AUTH_UNAUTHORIZED);
    return user;
  }
}
