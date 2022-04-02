import { ConflictException, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CurrencyEnum, ErrorTypeEnum } from 'src/common/enums';
import { DatabaseModule } from 'src/database';
import { ConfigModule } from 'src/config';

import { ExchangeRateModule } from '../exchangerate';
import { AccountEntity } from '../accounts/entities';
import { CategoriesModule } from '../categories';
import { AccountsModule } from '../accounts';

import { SelectTransactionsDto } from './dto';
import { TransactionEntity, TransactionTypeEnum } from './entities';

import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  const expected = {
    id: 'd2727cf0-8631-48ea-98fd-29d7404b1bd2',
    amount: 10,
    description: 'Description',
    date: new Date(),
    type: TransactionTypeEnum.EXPENSE,
    owner: {
      id: '067f2f3e-b936-4029-93d6-b2f58ae4f489',
      baseCurrency: CurrencyEnum.UAH,
    },
    account: {
      id: 'd2727cf0-8631-48ea-98fd-29d7404b1bca',
    },
    category: {
      id: 'd2727cf0-8631-48ea-98fd-29d7404b1bca',
    },
  } as TransactionEntity;

  let service: TransactionsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([TransactionEntity, AccountEntity]),
        ConfigModule,
        DatabaseModule,
        AccountsModule,
        CategoriesModule,
        ExchangeRateModule,
      ],
      providers: [TransactionsService],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOne', () => {
    it('should be return transaction entity', async () => {
      const received = await service.createOne(expected, expected.owner);
      expect(received).toBeInstanceOf(TransactionEntity);
      expect(received.id).toEqual(expected.id);
    });

    it('should be return conflict exception', async () => {
      const error = new ConflictException(ErrorTypeEnum.TRANSACTION_ALREADY_EXIST);
      return service.createOne(expected, expected.owner).catch((err) => {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('selectAll', () => {
    it('should be return transactions pagination entity', async () => {
      const received = await service.selectAll();
      expect(received.length).toEqual(expect.any(Number));
    });

    it('should be return not found exception', async () => {
      const options = plainToInstance(SelectTransactionsDto, { page: -1 });
      const error = new NotFoundException(ErrorTypeEnum.TRANSACTIONS_NOT_FOUND);
      return service.selectAll(options).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('selectOne', () => {
    it('should be return transaction entity', async () => {
      const received = await service.selectOne({ id: expected.id });
      expect(received).toBeInstanceOf(TransactionEntity);
      expect(received.id).toEqual(expected.id);
    });

    it('should be return not found exception', async () => {
      const error = new NotFoundException(ErrorTypeEnum.TRANSACTION_NOT_FOUND);
      return service.selectOne({ id: '' }).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('updateOne', () => {
    it('should be return transaction entity', async () => {
      const received = await service.updateOne({ id: expected.id }, expected.owner, {
        description: 'Description 2',
      });
      expect(received).toBeInstanceOf(TransactionEntity);
      expect(received.description).not.toEqual(expected.description);
      expect(received.id).toEqual(expected.id);
    });

    it('should be return conflict exception', async () => {
      const error = new NotFoundException(ErrorTypeEnum.TRANSACTION_NOT_FOUND);
      return service.updateOne({ id: expected.id }, expected.owner, {}).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('deleteOne', () => {
    it('should be return transaction entity', async () => {
      const received = await service.deleteOne({ id: expected.id }, expected.owner);
      expect(received).toBeInstanceOf(TransactionEntity);
    });

    it('should be return not found exception', async () => {
      const error = new NotFoundException(ErrorTypeEnum.TRANSACTION_NOT_FOUND);

      jest.spyOn(service, 'selectOne').mockImplementationOnce(async () => new TransactionEntity());
      jest.spyOn(service, 'genReverseState').mockImplementationOnce(() => new TransactionEntity());
      jest.spyOn(service, 'processOne').mockImplementationOnce(async () => new TransactionEntity());

      return service.deleteOne({ id: '' }, expected.owner).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });
  });
});
