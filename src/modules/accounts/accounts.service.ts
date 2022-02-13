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

import { PaginationAccountsDto } from './dto';
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
  ) {}

  /**
   * [description]
   * @param entityLike
   * @param options
   */
  public async createOne(
    entityLike: Partial<AccountEntity>,
    options: SaveOptions = { transaction: false },
  ): Promise<AccountEntity> {
    return this.accountEntityRepository.manager.transaction(async () => {
      const entity = this.accountEntityRepository.create(entityLike);
      const { id } = await this.accountEntityRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.ACCOUNT_ALREADY_EXIST);
      });

      return this.selectOne({ id }, { loadEagerRelations: true });
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
  ): Promise<PaginationAccountsDto> {
    const qb = this.find(classToPlain(options));
    if (options.where) qb.where(options.where);
    if (owner) qb.andWhere({ owner });

    return qb
      .getManyAndCount()
      .then((data) => new PaginationAccountsDto(data))
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.ACCOUNTS_NOT_FOUND);
      });
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
   * @param entityLike
   * @param options
   */
  public async updateOne(
    conditions: Partial<AccountEntity>,
    entityLike: Partial<AccountEntity>,
    options: SaveOptions = { transaction: false },
  ): Promise<AccountEntity> {
    return this.accountEntityRepository.manager.transaction(async () => {
      const mergeIntoEntity = await this.selectOne(conditions);
      const entity = this.accountEntityRepository.merge(mergeIntoEntity, entityLike);
      const { id } = await this.accountEntityRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.ACCOUNT_ALREADY_EXIST);
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
    conditions: FindConditions<AccountEntity>,
    options: RemoveOptions = { transaction: false },
  ): Promise<AccountEntity> {
    return this.accountEntityRepository.manager.transaction(async () => {
      const entity = await this.selectOne(conditions);
      return this.accountEntityRepository.remove(entity, options).catch(() => {
        throw new NotFoundException(ErrorTypeEnum.ACCOUNT_NOT_FOUND);
      });
    });
  }
}
