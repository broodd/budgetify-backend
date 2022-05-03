import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

import { ErrorTypeEnum } from 'src/common/enums';

import { UserEntity } from '../../users/entities';

import { JwtRefreshGuard } from './jwt-refresh.guard';

describe('JwtRefreshGuard', () => {
  const expected = { id: '1' } as UserEntity;

  it('should be defined', () => {
    expect(new JwtRefreshGuard()).toBeDefined();
  });

  describe('handleRequest', () => {
    it('should be return user entity without roles metadata', () => {
      const received = new JwtRefreshGuard().handleRequest(null, expected, null);
      expect(received).toEqual(expected);
    });

    it('should be return unauthorized exception - AUTH_INVALID_REFRESH_TOKEN', () => {
      const error = new UnauthorizedException(ErrorTypeEnum.AUTH_INVALID_REFRESH_TOKEN);
      try {
        new JwtRefreshGuard().handleRequest(null, null, new Error());
      } catch (received) {
        expect(received).toBeInstanceOf(UnauthorizedException);
        expect(received).toEqual(error);
      }
    });

    it('should be return unauthorized exception - AUTH_UNAUTHORIZED', () => {
      const error = new UnauthorizedException(ErrorTypeEnum.AUTH_UNAUTHORIZED);
      try {
        new JwtRefreshGuard().handleRequest(null, null, null);
      } catch (received) {
        expect(received).toBeInstanceOf(UnauthorizedException);
        expect(received).toEqual(error);
      }
    });

    it('should be return forbidden exception', () => {
      const error = new ForbiddenException(ErrorTypeEnum.AUTH_FORBIDDEN);
      try {
        new JwtRefreshGuard().handleRequest(null, expected, null);
      } catch (received) {
        expect(received).toBeInstanceOf(ForbiddenException);
        expect(received).toEqual(error);
      }
    });
  });
});
