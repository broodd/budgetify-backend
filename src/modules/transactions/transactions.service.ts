import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { classToPlain } from 'class-transformer';
import {
  Repository,
  SaveOptions,
  RemoveOptions,
  FindConditions,
  FindOneOptions,
  FindManyOptions,
  FindOptionsUtils,
  SelectQueryBuilder,
} from 'typeorm';

import { ErrorTypeEnum } from 'src/common/enums';

import { AccountEntity } from '../accounts/entities';
import { UserEntity } from '../users/entities';

import { PaginationTransactionsDto } from './dto';
import { TransactionEntity, TransactionTypeEnum } from './entities';

/**
 * [description]
 */
@Injectable()
export class TransactionsService {
  /**
   * [description]
   * @param transactionEntityRepository
   */
  constructor(
    @InjectRepository(TransactionEntity)
    public readonly transactionEntityRepository: Repository<TransactionEntity>,

    @InjectRepository(AccountEntity)
    public readonly accountEntityRepository: Repository<AccountEntity>,
  ) {}

  /**
   * [description]
   * @param entityLike
   * @param options
   */
  public async createOne(
    entityLike: Partial<TransactionEntity>,
    options: SaveOptions = { transaction: false },
  ): Promise<TransactionEntity> {
    return this.transactionEntityRepository.manager.transaction(async () => {
      const { type, amount, account, toTransferAccount } = entityLike;
      const absAmount = Math.abs(amount);

      if (type === TransactionTypeEnum.TRANSFER) {
        await Promise.all([
          this.accountEntityRepository.decrement(account, 'balance', absAmount),
          this.accountEntityRepository.increment(toTransferAccount, 'balance', absAmount),
        ]);
      } else if (type === TransactionTypeEnum.EXPENSE) {
        await this.accountEntityRepository.decrement(account, 'balance', absAmount);
      } else if (type === TransactionTypeEnum.INCOME) {
        await this.accountEntityRepository.increment(account, 'balance', absAmount);
      }

      const entity = this.transactionEntityRepository.create(entityLike);
      const { id } = await this.transactionEntityRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.TRANSACTION_ALREADY_EXIST);
      });

      return this.selectOne({ id }, { loadEagerRelations: true });
    });
  }

  /**
   *  [description]
   * @param optionsOrConditions
   */
  public find(
    optionsOrConditions?: FindManyOptions<TransactionEntity>,
  ): SelectQueryBuilder<TransactionEntity> {
    const metadata = this.transactionEntityRepository.metadata;
    const qb = this.transactionEntityRepository.createQueryBuilder(
      FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name,
    );

    if (
      !FindOptionsUtils.isFindManyOptions(optionsOrConditions) ||
      optionsOrConditions.loadEagerRelations !== false
    ) {
      FindOptionsUtils.joinEagerRelations(qb, qb.alias, metadata);

      /**
       * Place for common relation
       * @example qb.leftJoinAndSelect('TransactionEntity.relation_field', 'TransactionEntity_relation_field')
       */
    }

    return FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions);
  }

  /**
   * [description]
   * @param options
   */
  public async selectAll(
    options: FindManyOptions<TransactionEntity> = { loadEagerRelations: false },
    owner?: Partial<UserEntity>,
  ): Promise<PaginationTransactionsDto> {
    const qb = this.find(classToPlain(options));
    if (options.where) qb.where(options.where);
    if (owner) qb.andWhere({ owner });

    return qb
      .getManyAndCount()
      .then((data) => new PaginationTransactionsDto(data))
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.TRANSACTIONS_NOT_FOUND);
      });
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  public async selectOne(
    conditions: FindConditions<TransactionEntity>,
    options: FindOneOptions<TransactionEntity> = { loadEagerRelations: false },
  ): Promise<TransactionEntity> {
    return this.find(classToPlain(options))
      .where(conditions)
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.TRANSACTION_NOT_FOUND);
      });
  }

  /**
   * [description]
   * @param conditions
   * @param entityLike
   * @param options
   */
  public async updateOne(
    conditions: Partial<TransactionEntity>,
    entityLike: Partial<TransactionEntity>,
    options: SaveOptions = { transaction: false },
  ): Promise<TransactionEntity> {
    return this.transactionEntityRepository.manager.transaction(async () => {
      const mergeIntoEntity = await this.selectOne(conditions);
      const entity = this.transactionEntityRepository.merge(mergeIntoEntity, entityLike);
      const { id } = await this.transactionEntityRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.TRANSACTION_ALREADY_EXIST);
      });

      return this.selectOne({ id }, { loadEagerRelations: true });
    });
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  public async deleteOne(
    conditions: FindConditions<TransactionEntity>,
    options: RemoveOptions = { transaction: false },
  ): Promise<TransactionEntity> {
    return this.transactionEntityRepository.manager.transaction(async () => {
      const entity = await this.selectOne(conditions);
      return this.transactionEntityRepository.remove(entity, options).catch(() => {
        throw new NotFoundException(ErrorTypeEnum.TRANSACTION_NOT_FOUND);
      });
    });
  }
}
