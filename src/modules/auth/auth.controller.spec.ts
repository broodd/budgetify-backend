import { Test, TestingModule } from '@nestjs/testing';

import { UserEntity } from '../users/entities';
import { UsersService } from '../users';

import { JwtResponseDto, SelectProfileDto } from './dto';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const options = {} as SelectProfileDto;
  const expected = {} as UserEntity;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            selectOne: () => new UserEntity(),
            updateOne: () => new UserEntity(),
            deleteOne: () => new UserEntity(),
          },
        },
        {
          provide: AuthService,
          useValue: {
            createToken: () => new JwtResponseDto(),
            createUser: () => new JwtResponseDto(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createToken', () => {
    it('should be return jwt entity', async () => {
      const received = await controller.createToken(expected);
      expect(received).toBeInstanceOf(JwtResponseDto);
    });
  });

  describe('createUser', () => {
    it('should be return jwt entity', async () => {
      const received = await controller.createUser(expected);
      expect(received).toBeInstanceOf(JwtResponseDto);
    });
  });

  describe('selectUser', () => {
    it('should be return user entity', async () => {
      const received = await controller.selectUser(expected, options);
      expect(received).toBeInstanceOf(UserEntity);
    });
  });
});
