import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import {
  Repository,
  SaveOptions,
  FindOneOptions,
  FindManyOptions,
  FindOptionsWhere,
  FindOptionsUtils,
  SelectQueryBuilder,
} from 'typeorm';

import { CurrencyEnum, ErrorTypeEnum } from 'src/common/enums';

import { CurrencyRateCacheRecord } from '../exchangerate/types';
import { AccountEntity } from '../accounts/entities';
import { ExchangeRateService } from '../exchangerate';
import { CategoriesService } from '../categories';
import { UserEntity } from '../users/entities';
import { AccountsService } from '../accounts';

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
    public readonly exchangeRateService: ExchangeRateService,
    public readonly categoriesService: CategoriesService,
    public readonly accountsService: AccountsService,
  ) {}

  /**
   * [description]
   * @param entityLike
   * @param owner
   */
  public async processOne(
    entityLike: Partial<TransactionEntity>,
    owner: Partial<UserEntity>,
  ): Promise<Partial<TransactionEntity>> {
    const { type, amount, account } = entityLike;
    const intAmount = amount * 100;

    if (type === TransactionTypeEnum.EXPENSE) {
      await this.accountEntityRepository.decrement(
        { id: account.id, owner: { id: owner.id } },
        'balance',
        intAmount,
      );
    } else {
      await this.accountEntityRepository.increment(
        { id: account.id, owner: { id: owner.id } },
        'balance',
        intAmount,
      );
    }

    return entityLike;
  }

  /**
   * [description]
   * @param entity
   */
  public genReverseState(entity: Partial<TransactionEntity>): Partial<TransactionEntity> {
    const category = { id: entity.category.id };
    const account = { id: entity.account.id };
    const type =
      entity.type === TransactionTypeEnum.EXPENSE
        ? TransactionTypeEnum.INCOME
        : TransactionTypeEnum.EXPENSE;

    return plainToInstance(TransactionEntity, { ...entity, type, category, account });
  }

  /**
   * [description]
   * @param rates
   * @param account
   * @param baseCurrency
   */
  public addAmountInBaseCurrency({
    baseCurrency,
    transaction,
    account,
    rates,
  }: {
    transaction: Partial<TransactionEntity>;
    account: Partial<AccountEntity>;
    rates: CurrencyRateCacheRecord;
    baseCurrency: CurrencyEnum;
  }): TransactionEntity {
    if (!transaction.currencyCode) return plainToInstance(TransactionEntity, transaction);
    const rate = rates[transaction.currencyCode][baseCurrency];
    const accountRate = rates[transaction.currencyCode][account.currencyCode];

    const amountInBaseCurrency = parseFloat((rate * transaction.amount).toFixed(2));
    const amountInAccountCurrency = parseFloat((accountRate * transaction.amount).toFixed(2));

    return plainToInstance(TransactionEntity, {
      ...transaction,
      amountInBaseCurrency,
      amountInAccountCurrency,
    });
  }

  /**
   * [description]
   * @param entityLike
   * @param owner
   * @param options
   */
  public async createOne(
    entityLike: Partial<TransactionEntity>,
    owner: Partial<UserEntity>,
    options: SaveOptions = { transaction: false },
  ): Promise<TransactionEntity> {
    return this.transactionEntityRepository.manager.transaction(async () => {
      const { currencyCode, amount } = entityLike;

      const [account] = await Promise.all([
        this.accountsService.selectOne(
          { id: entityLike.account.id, owner: { id: owner.id } },
          {
            loadEagerRelations: false,
            select: { id: true, currencyCode: true },
          },
        ),
        this.categoriesService.selectOne(
          { id: entityLike.category.id, owner: { id: owner.id } },
          { loadEagerRelations: false, select: { id: true } },
        ),
      ]);

      if (currencyCode) {
        const convertAmount = await this.exchangeRateService.selectOneConvert(
          amount,
          currencyCode,
          account.currencyCode,
        );
        entityLike = { ...entityLike, currencyCode };
        await this.processOne({ ...entityLike, amount: convertAmount }, owner);
      } else {
        entityLike = { ...entityLike, currencyCode: account.currencyCode };
        await this.processOne({ ...entityLike, amount }, owner);
      }

      const entity = this.transactionEntityRepository.create(entityLike);
      const { id } = await this.transactionEntityRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.TRANSACTION_ALREADY_EXIST);
      });

      return this.selectOneWithBaseBalance({ id }, owner, { loadEagerRelations: true });
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

    /**
     * Place for add custom order
     * qb.addSelect('__custom') and then
     * order by it from property order from options
     * @example
     */
    /* if (optionsOrConditions.order)
      optionsOrConditions.order = setFindOrder(qb, optionsOrConditions.order); */

    /**
     * Place for common relation
     * @example
     */
    /* if (
      !FindOptionsUtils.isFindManyOptions(optionsOrConditions) ||
      optionsOrConditions.loadEagerRelations !== false
    ) {
      qb.leftJoinAndSelect('Entity.relation_field', 'Entity_relation_field')
    } */

    return qb.setFindOptions(optionsOrConditions);
  }

  /**
   * [description]
   * @param options
   */
  public async selectAll(
    options: FindManyOptions<TransactionEntity> = { loadEagerRelations: false },
    owner?: Partial<UserEntity>,
  ): Promise<TransactionEntity[]> {
    const qb = this.find(instanceToPlain(options));
    if (options.where) qb.where(options.where);
    if (owner) qb.andWhere({ owner });

    return qb.getMany().catch(() => {
      throw new NotFoundException(ErrorTypeEnum.TRANSACTIONS_NOT_FOUND);
    });
  }

  /**
   * [description]
   * @param options
   */
  public async selectAllWithBaseBalance(
    owner: Partial<UserEntity>,
    options: FindManyOptions<TransactionEntity> = { loadEagerRelations: false },
  ): Promise<TransactionEntity[]> {
    const rates = await this.exchangeRateService.selectAllFromCacheAsRecord();
    const transactions = await this.selectAll(options, owner);
    return transactions.map((transaction) =>
      plainToInstance(TransactionEntity, {
        ...this.addAmountInBaseCurrency({
          baseCurrency: owner.baseCurrency,
          account: transaction.account,
          transaction,
          rates,
        }),
        account: this.accountsService.addBalanceInBaseCurrency({
          baseCurrency: owner.baseCurrency,
          account: transaction.account,
          rates,
        }),
      }),
    );
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  public async selectOne(
    conditions: FindOptionsWhere<TransactionEntity>,
    options: FindOneOptions<TransactionEntity> = { loadEagerRelations: false },
  ): Promise<TransactionEntity> {
    return this.find(instanceToPlain(options))
      .where(conditions)
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.TRANSACTION_NOT_FOUND);
      });
  }

  /**
   * [description]
   * @param conditions
   * @param owner
   * @param options
   */
  public async selectOneWithBaseBalance(
    conditions: FindOptionsWhere<TransactionEntity>,
    owner: Partial<UserEntity>,
    options: FindOneOptions<TransactionEntity> = { loadEagerRelations: false },
  ): Promise<TransactionEntity> {
    const rates = await this.exchangeRateService.selectAllFromCacheAsRecord();
    return this.selectOne(conditions, options).then((transaction) =>
      plainToInstance(TransactionEntity, {
        ...this.addAmountInBaseCurrency({
          baseCurrency: owner.baseCurrency,
          account: transaction.account,
          transaction,
          rates,
        }),
        account: this.accountsService.addBalanceInBaseCurrency({
          rates,
          account: transaction.account,
          baseCurrency: owner.baseCurrency,
        }),
      }),
    );
  }

  /**
   * [description]
   * @param conditions
   * @param entityLike
   * @param options
   */
  public async updateOne(
    conditions: FindOptionsWhere<TransactionEntity>,
    owner: Partial<UserEntity>,
    entityLike: Partial<TransactionEntity>,
    options: SaveOptions = { transaction: false },
  ): Promise<TransactionEntity> {
    return this.transactionEntityRepository.manager.transaction(async () => {
      const mergeIntoEntity = await this.selectOne(conditions, {
        relations: {
          category: true,
          account: true,
        },
      });

      await this.processOne(this.genReverseState(mergeIntoEntity), owner);
      const entity = this.transactionEntityRepository.merge(mergeIntoEntity, entityLike);
      await this.processOne(entity, owner);

      const { id } = await this.transactionEntityRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.TRANSACTION_ALREADY_EXIST);
      });

      return this.selectOneWithBaseBalance({ id }, owner, { loadEagerRelations: true });
    });
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  public async deleteOne(
    conditions: FindOptionsWhere<TransactionEntity>,
    owner: Partial<UserEntity>,
  ): Promise<TransactionEntity> {
    return this.transactionEntityRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const entity = await this.selectOne(conditions, {
          relations: {
            category: true,
            account: true,
          },
        });

        await this.processOne(this.genReverseState(entity), owner);

        const entityReversed = await this.selectOneWithBaseBalance(conditions, owner, {
          relations: {
            category: true,
            account: true,
          },
        });

        await transactionalEntityManager
          .delete(TransactionEntity, conditions)
          .then(({ affected }) => {
            if (!affected) throw new NotFoundException(ErrorTypeEnum.TRANSACTION_NOT_FOUND);
          })
          .catch(() => {
            throw new NotFoundException(ErrorTypeEnum.TRANSACTION_NOT_FOUND);
          });

        return entityReversed;
      },
    );
  }
}
