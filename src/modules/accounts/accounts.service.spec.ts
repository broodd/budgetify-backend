import { ConflictException, NotFoundException } from '@nestjs/common';
import { plainToClassFromExist } from 'class-transformer';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ErrorTypeEnum } from 'src/common/enums';
import { DatabaseModule } from 'src/database';
import { ConfigModule } from 'src/config';

import { PaginationAccountsDto, SelectAccountsDto } from './dto';
import { AccountEntity } from './entities';

import { AccountsService } from './accounts.service';

describe('AccountsService', () => {
  const expected = {
    id: 'd2727cf0-8631-48ea-98fd-29d7404b1bc3',
    name: 'Account',
    balance: 0,
    owner: {
      id: '067f2f3e-b936-4029-93d6-b2f58ae4f489',
    },
  } as AccountEntity;

  let service: AccountsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([AccountEntity]), ConfigModule, DatabaseModule],
      providers: [AccountsService],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOne', () => {
    it('should be return account entity', async () => {
      const received = await service.createOne(expected);
      expect(received).toBeInstanceOf(AccountEntity);
      expect(received.id).toEqual(expected.id);
    });

    it('should be return conflict exception', async () => {
      const error = new ConflictException(ErrorTypeEnum.ACCOUNT_ALREADY_EXIST);
      return service.createOne(expected).catch((err) => {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('selectAll', () => {
    it('should be return accounts pagination entity', async () => {
      const received = await service.selectAll();
      expect(received).toBeInstanceOf(PaginationAccountsDto);
      expect(received.count).toEqual(expect.any(Number));
    });

    it('should be return not found exception', async () => {
      const options = plainToClassFromExist(new SelectAccountsDto(), { page: -1 });
      const error = new NotFoundException(ErrorTypeEnum.ACCOUNTS_NOT_FOUND);
      return service.selectAll(options).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('selectOne', () => {
    it('should be return account entity', async () => {
      const received = await service.selectOne({ id: expected.id });
      expect(received).toBeInstanceOf(AccountEntity);
      expect(received.id).toEqual(expected.id);
    });

    it('should be return not found exception', async () => {
      const error = new NotFoundException(ErrorTypeEnum.ACCOUNT_NOT_FOUND);
      return service.selectOne({ id: '' }).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('updateOne', () => {
    it('should be return account entity', async () => {
      const received = await service.updateOne({ id: expected.id }, { balance: 10.5 });
      expect(received).toBeInstanceOf(AccountEntity);
      expect(received.balance).not.toEqual(expected.balance);
      expect(received.id).toEqual(expected.id);
    });

    it('should be return conflict exception', async () => {
      const error = new NotFoundException(ErrorTypeEnum.ACCOUNT_NOT_FOUND);
      return service.updateOne({ id: expected.id }, {}).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });

    it('should be return not found exception', async () => {
      const error = new ConflictException(ErrorTypeEnum.ACCOUNT_ALREADY_EXIST);

      jest
        .spyOn(service, 'selectOne')
        .mockImplementationOnce(async () => ({ id: '' } as AccountEntity));

      return service.updateOne({ id: '' }, { balance: null }).catch((err) => {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('deleteOne', () => {
    it('should be return account entity', async () => {
      const received = await service.deleteOne({ id: expected.id });
      expect(received).toBeInstanceOf(AccountEntity);
      expect(received.id).toEqual(undefined);
    });

    it('should be return not found exception', async () => {
      const error = new NotFoundException(ErrorTypeEnum.ACCOUNT_NOT_FOUND);

      jest.spyOn(service, 'selectOne').mockImplementationOnce(async () => new AccountEntity());

      return service.deleteOne({ id: '' }).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });
  });
});
