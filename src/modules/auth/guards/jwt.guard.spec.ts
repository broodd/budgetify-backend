import { ForbiddenException, UnauthorizedException } from '@nestjs/common';

import { ErrorTypeEnum } from 'src/common/enums';

import { UserEntity } from '../../users/entities';

import { JwtAuthGuard } from './jwt.guard';

describe('JwtAuthGuard', () => {
  const expected = { id: '1' } as UserEntity;

  it('should be defined', () => {
    expect(new JwtAuthGuard()).toBeDefined();
  });

  describe('handleRequest', () => {
    it('should be return user entity without roles metadata', () => {
      const received = new JwtAuthGuard().handleRequest(null, expected, null);
      expect(received).toEqual(expected);
    });

    it('should be return unauthorized exception - AUTH_INVALID_TOKEN', () => {
      const error = new UnauthorizedException(ErrorTypeEnum.AUTH_INVALID_TOKEN);
      try {
        new JwtAuthGuard().handleRequest(null, null, new Error());
      } catch (received) {
        expect(received).toBeInstanceOf(UnauthorizedException);
        expect(received).toEqual(error);
      }
    });

    it('should be return unauthorized exception - AUTH_UNAUTHORIZED', () => {
      const error = new UnauthorizedException(ErrorTypeEnum.AUTH_UNAUTHORIZED);
      try {
        new JwtAuthGuard().handleRequest(null, null, null);
      } catch (received) {
        expect(received).toBeInstanceOf(UnauthorizedException);
        expect(received).toEqual(error);
      }
    });

    it('should be return forbidden exception', () => {
      const error = new ForbiddenException(ErrorTypeEnum.AUTH_FORBIDDEN);
      try {
        new JwtAuthGuard().handleRequest(null, expected, null);
      } catch (received) {
        expect(received).toBeInstanceOf(ForbiddenException);
        expect(received).toEqual(error);
      }
    });
  });
});
