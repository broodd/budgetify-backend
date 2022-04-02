import { plainToInstance } from 'class-transformer';
import { Test, TestingModule } from '@nestjs/testing';

import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';

import { CreateAccountDto, UpdateAccountDto, SelectAccountsDto } from './dto';
import { UserEntity } from '../users/entities';
import { AccountEntity } from './entities';

describe('AccountsController', () => {
  const user = {
    id: '067f2f3e-b936-4029-93d6-b2f58ae4f489',
  } as UserEntity;

  const optionsAll = new SelectAccountsDto();
  const createOne = new CreateAccountDto();
  const updateDto = new UpdateAccountDto();
  const owner = new AccountEntity();

  let controller: AccountsController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        {
          provide: AccountsService,
          useValue: {
            createOne: (data: Partial<AccountEntity>) =>
              plainToInstance(AccountEntity, { ...data, ...owner }),
            selectAll: () => [[owner], 1],
            selectAllWithBaseBalance: () => [[owner], 1],
            selectOne: () => new AccountEntity(),
            selectOneWithBaseBalance: () => new AccountEntity(),
            updateOne: (owner: AccountEntity, data: Partial<AccountEntity>) =>
              plainToInstance(AccountEntity, { ...owner, ...data }),
            deleteOne: () => new AccountEntity(),
          },
        },
      ],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOne', () => {
    it('should be return account entity', async () => {
      const received = await controller.createOne(createOne, user);
      expect(received).toBeInstanceOf(AccountEntity);
    });
  });

  describe('selectAll', () => {
    it('should be return account entity', async () => {
      const received = await controller.selectAll(optionsAll, user);
      expect(received.length).toEqual(expect.any(Number));
    });
  });

  describe('updateOne', () => {
    it('should be return account entity', async () => {
      const entityLike = plainToInstance(UpdateAccountDto, { ...owner, ...updateDto });
      const received = await controller.updateOne(owner, entityLike, user);
      expect(received).toBeInstanceOf(AccountEntity);
    });
  });

  describe('deleteOne', () => {
    it('should be return account entity', async () => {
      const received = await controller.deleteOne(owner, user);
      expect(received).toBeInstanceOf(AccountEntity);
    });
  });
});
