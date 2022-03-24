import { plainToClass, classToClassFromExist } from 'class-transformer';
import { Test, TestingModule } from '@nestjs/testing';

import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

import { TransactionEntity } from './entities';
import { CreateTransactionDto, UpdateTransactionDto, SelectTransactionsDto } from './dto';
import { UserEntity } from '../users/entities';

describe('TransactionsController', () => {
  const user = {
    id: '067f2f3e-b936-4029-93d6-b2f58ae4f489',
  } as UserEntity;

  const optionsAll = new SelectTransactionsDto();
  const createOne = new CreateTransactionDto();
  const updateDto = new UpdateTransactionDto();
  const owner = new TransactionEntity();

  let controller: TransactionsController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            createOne: (data: Partial<TransactionEntity>) => classToClassFromExist(data, owner),
            selectAll: () => [[owner], 1],
            selectAllWithBaseBalance: () => [[owner], 1],
            selectOne: () => new TransactionEntity(),
            selectOneWithBaseBalance: () => new TransactionEntity(),
            updateOne: (owner: TransactionEntity, data: Partial<TransactionEntity>) =>
              plainToClass(TransactionEntity, { ...owner, ...data }),
            deleteOne: () => new TransactionEntity(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOne', () => {
    it('should be return transaction entity', async () => {
      const received = await controller.createOne(createOne, user);
      expect(received).toBeInstanceOf(TransactionEntity);
    });
  });

  describe('selectAll', () => {
    it('should be return transaction entity', async () => {
      const received = await controller.selectAll(optionsAll, user);
      expect(received.length).toEqual(expect.any(Number));
    });
  });

  describe('updateOne', () => {
    it('should be return transaction entity', async () => {
      const entityLike = classToClassFromExist({ description: '' }, updateDto);
      const received = await controller.updateOne(owner, entityLike, user);
      expect(received).toBeInstanceOf(TransactionEntity);
    });
  });

  describe('deleteOne', () => {
    it('should be return transaction entity', async () => {
      const received = await controller.deleteOne(owner, user);
      expect(received).toBeInstanceOf(TransactionEntity);
    });
  });
});
