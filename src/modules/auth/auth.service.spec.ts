import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';

import { ConfigModule, ConfigService } from 'src/config';
import { ErrorTypeEnum } from 'src/common/enums';
import { DatabaseModule } from 'src/database';

import { UserEntity } from '../users/entities';
import { UsersModule } from '../users';

import { AuthService } from './auth.service';
import { CreateProfileDto } from './dto';

describe('AuthService', () => {
  const PASSPORT_EXPIRES = 0;
  const expected = {
    id: '067f2f3e-b936-4029-93d6-b2f58ae4f489',
    email: 'admin@gmail.com',
  } as UserEntity;

  let service: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'some-secret',
        }),
        DatabaseModule,
        ConfigModule,
        UsersModule,
      ],
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: () => PASSPORT_EXPIRES,
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('generateToken', () => {
    const received = service.generateToken(expected);
    expect(received.token).toEqual(expect.any(String));
  });

  describe('createToken', () => {
    it('should be return jwt entity', async () => {
      const received = await service.createToken({ ...expected, password: 'password' });
      expect(received.token).toEqual(expect.any(String));
    });

    it('should be return unauthorized exception', async () => {
      const error = new UnauthorizedException(ErrorTypeEnum.AUTH_INCORRECT_CREDENTIALS);
      return service.createToken({ ...expected, password: '' }).catch((err) => {
        expect(err).toBeInstanceOf(UnauthorizedException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('createUser', () => {
    const data = {
      email: 'email',
      password: 'password',
    } as CreateProfileDto;

    it('should be return jwt entity', async () => {
      const received = await service.createUser(data);
      expect(received.token).toEqual(expect.any(String));
    });

    it('should be return conflict exception', async () => {
      const error = new ConflictException(ErrorTypeEnum.USER_ALREADY_EXIST);
      return service.createUser({ ...data, email: expected.email }).catch((err) => {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('validateUser', () => {
    it('should be return user entity', async () => {
      const received = await service.validateUser(expected);
      expect(received.id).toEqual(expected.id);
    });

    it('should be return unauthorized exception', async () => {
      const error = new UnauthorizedException(ErrorTypeEnum.AUTH_INCORRECT_CREDENTIALS);
      return service.validateUser({ ...expected, password: '' }).catch((err) => {
        expect(err).toBeInstanceOf(UnauthorizedException);
        expect(err).toEqual(error);
      });
    });
  });
});
