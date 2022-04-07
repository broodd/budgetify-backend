import { ApiProperty, PickType } from '@nestjs/swagger';

/**
 * [description]
 */
export class JwtTokensDto {
  /**
   * [description]
   */
  @ApiProperty()
  public readonly token: string;

  /**
   * [description]
   */
  @ApiProperty()
  public readonly refreshToken: string;
}

/**
 * [description]
 */
export class JwtRefreshTokenDto extends PickType(JwtTokensDto, ['refreshToken']) {}

/**
 * [description]
 */
export class JwtAccessTokenPayloadDto {
  /**
   * [description]
   */
  public readonly id: string;

  /**
   * [description]
   */
  public readonly refreshTokenId: string;
}

/**
 * [description]
 */
export class JwtRefreshTokenPayloadDto extends JwtAccessTokenPayloadDto {
  /**
   * [description]
   */
  public readonly ppid: string;
}
