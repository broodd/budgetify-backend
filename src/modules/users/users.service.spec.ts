import { ConflictException, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ErrorTypeEnum } from 'src/common/enums';
import { DatabaseModule } from 'src/database';
import { ConfigModule } from 'src/config';

import { SelectUsersDto } from './dto';
import { UserEntity } from './entities';

import { UsersService } from './users.service';

describe('UsersService', () => {
  const expected = {
    id: 'd2727cf0-8631-48ea-98fd-29d7404b1bfd',
    email: 'test@e.mail',
    password: 'password',
  } as UserEntity;

  let service: UsersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([UserEntity]), ConfigModule, DatabaseModule],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOne', () => {
    it('should be return user entity', async () => {
      const received = await service.createOne(expected);
      expect(received).toBeInstanceOf(UserEntity);
      expect(received.id).toEqual(expected.id);
    });

    it('should be return conflict exception', async () => {
      const error = new ConflictException(ErrorTypeEnum.USER_ALREADY_EXIST);
      return service.createOne(expected).catch((err) => {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('selectAll', () => {
    it('should be return users pagination entity', async () => {
      const received = await service.selectAll();
      expect(received.length).toEqual(expect.any(Number));
    });

    it('should be return not found exception', async () => {
      const options = plainToInstance(SelectUsersDto, { page: -1 });
      const error = new NotFoundException(ErrorTypeEnum.USERS_NOT_FOUND);
      return service.selectAll(options).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('selectOne', () => {
    it('should be return user entity', async () => {
      const received = await service.selectOne({ id: expected.id });
      expect(received).toBeInstanceOf(UserEntity);
      expect(received.id).toEqual(expected.id);
    });

    it('should be return not found exception', async () => {
      const error = new NotFoundException(ErrorTypeEnum.USER_NOT_FOUND);
      return service.selectOne({ id: '' }).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('updateOne', () => {
    it('should be return user entity', async () => {
      const received = await service.updateOne({ id: expected.id }, { password: 'some-secret' });
      expect(received).toBeInstanceOf(UserEntity);
      expect(received.password).not.toEqual(expected.password);
      expect(received.id).toEqual(expected.id);
    });

    it('should be return conflict exception', async () => {
      const error = new NotFoundException(ErrorTypeEnum.USER_NOT_FOUND);
      return service.updateOne({ id: expected.id }, {}).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });

    it('should be return not found exception', async () => {
      const error = new ConflictException(ErrorTypeEnum.USER_ALREADY_EXIST);

      jest
        .spyOn(service, 'selectOne')
        .mockImplementationOnce(async () => ({ id: '' } as UserEntity));

      return service.updateOne({ id: '' }, { password: null }).catch((err) => {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('deleteOne', () => {
    it('should be return user entity', async () => {
      const received = await service.deleteOne({ id: expected.id });
      expect(received).toBeInstanceOf(UserEntity);
    });

    it('should be return not found exception', async () => {
      const error = new NotFoundException(ErrorTypeEnum.USER_NOT_FOUND);

      jest.spyOn(service, 'selectOne').mockImplementationOnce(async () => new UserEntity());

      return service.deleteOne({ id: '' }).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });
  });
});
