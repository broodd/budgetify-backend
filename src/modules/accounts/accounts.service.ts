import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { classToPlain, plainToClass } from 'class-transformer';
import {
  Repository,
  SaveOptions,
  FindConditions,
  FindOneOptions,
  FindManyOptions,
  FindOptionsUtils,
  SelectQueryBuilder,
} from 'typeorm';

import { CurrencyEnum, ErrorTypeEnum } from 'src/common/enums';

import { CurrencyRateCacheRecord } from '../exchangerate/types';
import { ExchangeRateService } from '../exchangerate';

import { AccountEntity } from './entities';
import { UserEntity } from '../users/entities';

/**
 * [description]
 */
@Injectable()
export class AccountsService {
  /**
   * [description]
   * @param accountEntityRepository
   */
  constructor(
    @InjectRepository(AccountEntity)
    public readonly accountEntityRepository: Repository<AccountEntity>,
    public readonly exchangeRateService: ExchangeRateService,
  ) {}

  public addBalanceInBaseCurrency({
    rates,
    account,
    baseCurrency,
  }: {
    rates: CurrencyRateCacheRecord;
    account: Partial<AccountEntity>;
    baseCurrency: CurrencyEnum;
  }): AccountEntity {
    const currencyRate = rates[account.currencyCode][baseCurrency];
    const balanceInBaseCurrency = parseFloat((currencyRate * account.balance).toFixed(2));
    return plainToClass(AccountEntity, {
      ...account,
      balanceInBaseCurrency,
    });
  }

  /**
   * [description]
   * @param entityLike
   * @param options
   */
  public async createOne(
    entityLike: Partial<AccountEntity>,
    owner: Partial<UserEntity>,
    options: SaveOptions = { transaction: false },
  ): Promise<AccountEntity> {
    return this.accountEntityRepository.manager.transaction(async () => {
      const entity = this.accountEntityRepository.create(entityLike);
      const { id } = await this.accountEntityRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.ACCOUNT_ALREADY_EXIST);
      });

      return this.selectOneWithBaseBalance({ id }, owner, { loadEagerRelations: true });
    });
  }

  /**
   *  [description]
   * @param optionsOrConditions
   */
  public find(
    optionsOrConditions?: FindManyOptions<AccountEntity>,
  ): SelectQueryBuilder<AccountEntity> {
    const metadata = this.accountEntityRepository.metadata;
    const qb = this.accountEntityRepository.createQueryBuilder(
      FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name,
    );

    if (
      !FindOptionsUtils.isFindManyOptions(optionsOrConditions) ||
      optionsOrConditions.loadEagerRelations !== false
    ) {
      FindOptionsUtils.joinEagerRelations(qb, qb.alias, metadata);

      /**
       * Place for common relation
       * @example qb.leftJoinAndSelect('AccountEntity.relation_field', 'AccountEntity_relation_field')
       */
    }

    return FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions);
  }

  /**
   * [description]
   * @param options
   */
  public async selectAll(
    options: FindManyOptions<AccountEntity> = { loadEagerRelations: false },
    owner?: Partial<UserEntity>,
  ): Promise<AccountEntity[]> {
    const qb = this.find(classToPlain(options));
    if (options.where) qb.where(options.where);
    if (owner) qb.andWhere({ owner });

    return qb.getMany().catch(() => {
      throw new NotFoundException(ErrorTypeEnum.ACCOUNTS_NOT_FOUND);
    });
  }

  /**
   * [description]
   * @param options
   */
  public async selectAllWithBaseBalance(
    owner: Partial<UserEntity>,
    options: FindManyOptions<AccountEntity> = { loadEagerRelations: false },
  ): Promise<AccountEntity[]> {
    const rates = await this.exchangeRateService.selectAllFromCacheAsRecord();
    const accounts = await this.selectAll(options, owner);
    return accounts.map((account) =>
      this.addBalanceInBaseCurrency({ rates, account, baseCurrency: owner.baseCurrency }),
    );
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  public async selectOne(
    conditions: FindConditions<AccountEntity>,
    options: FindOneOptions<AccountEntity> = { loadEagerRelations: false },
  ): Promise<AccountEntity> {
    return this.find(classToPlain(options))
      .where(conditions)
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.ACCOUNT_NOT_FOUND);
      });
  }

  /**
   * [description]
   * @param conditions
   * @param owner
   * @param options
   */
  public async selectOneWithBaseBalance(
    conditions: FindConditions<AccountEntity>,
    owner: Partial<UserEntity>,
    options: FindOneOptions<AccountEntity> = { loadEagerRelations: false },
  ): Promise<AccountEntity> {
    const rates = await this.exchangeRateService.selectAllFromCacheAsRecord();
    return this.find(classToPlain(options))
      .where(conditions)
      .getOneOrFail()
      .then((account) =>
        this.addBalanceInBaseCurrency({ rates, account, baseCurrency: owner.baseCurrency }),
      )
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.ACCOUNT_NOT_FOUND);
      });
  }

  /**
   * [description]
   * @param conditions
   * @param owner
   * @param entityLike
   * @param options
   */
  public async updateOne(
    conditions: Partial<AccountEntity>,
    owner: Partial<UserEntity>,
    entityLike: Partial<AccountEntity>,
    options: SaveOptions = { transaction: false },
  ): Promise<AccountEntity> {
    return this.accountEntityRepository.manager.transaction(async () => {
      const mergeIntoEntity = await this.selectOne(conditions);
      const entity = this.accountEntityRepository.merge(mergeIntoEntity, entityLike);
      const { id } = await this.accountEntityRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.ACCOUNT_ALREADY_EXIST);
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
    conditions: Partial<AccountEntity>,
    owner: Partial<UserEntity>,
  ): Promise<AccountEntity> {
    return this.accountEntityRepository.manager.transaction(async (transactionalEntityManager) => {
      const entity = await this.selectOne(conditions);
      await transactionalEntityManager
        .delete(AccountEntity, conditions)
        .then(({ affected }) => {
          if (!affected) throw new NotFoundException(ErrorTypeEnum.ACCOUNT_NOT_FOUND);
        })
        .catch(() => {
          throw new NotFoundException(ErrorTypeEnum.ACCOUNT_NOT_FOUND);
        });
      return entity;
    });
  }
}
