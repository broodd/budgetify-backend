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

  /**
   * [description]
   * @param rates
   * @param account
   * @param baseCurrency
   */
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
    return plainToInstance(AccountEntity, {
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
    options: FindManyOptions<AccountEntity> = { loadEagerRelations: false },
    owner?: Partial<UserEntity>,
  ): Promise<AccountEntity[]> {
    const qb = this.find(instanceToPlain(options));
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
    conditions: FindOptionsWhere<AccountEntity>,
    options: FindOneOptions<AccountEntity> = { loadEagerRelations: false },
  ): Promise<AccountEntity> {
    return this.find(instanceToPlain(options))
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
    conditions: FindOptionsWhere<AccountEntity>,
    owner: Partial<UserEntity>,
    options: FindOneOptions<AccountEntity> = { loadEagerRelations: false },
  ): Promise<AccountEntity> {
    const rates = await this.exchangeRateService.selectAllFromCacheAsRecord();
    return this.find(instanceToPlain(options))
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
    conditions: FindOptionsWhere<AccountEntity>,
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
   * @param onwer
   */
  public async deleteOne(
    conditions: FindOptionsWhere<AccountEntity>,
    owner: Partial<UserEntity>,
  ): Promise<AccountEntity> {
    return this.accountEntityRepository.manager.transaction(async (transactionalEntityManager) => {
      const entity = await this.selectOneWithBaseBalance(conditions, owner);
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
