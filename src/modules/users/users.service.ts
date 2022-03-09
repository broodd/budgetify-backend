import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { classToPlain } from 'class-transformer';
import {
  Repository,
  SaveOptions,
  FindConditions,
  FindOneOptions,
  FindManyOptions,
  FindOptionsUtils,
  SelectQueryBuilder,
} from 'typeorm';

import { ErrorTypeEnum } from 'src/common/enums';

import { UserEntity } from './entities';

/**
 * [description]
 */
@Injectable()
export class UsersService {
  /**
   * [description]
   * @param userEntityRepository
   */
  constructor(
    @InjectRepository(UserEntity)
    public readonly userEntityRepository: Repository<UserEntity>,
  ) {}

  /**
   * [description]
   * @param entityLike
   * @param options
   */
  public async createOne(
    entityLike: Partial<UserEntity>,
    options: SaveOptions = { transaction: false },
  ): Promise<UserEntity> {
    return this.userEntityRepository.manager.transaction(async () => {
      const entity = this.userEntityRepository.create(entityLike);
      const { id } = await this.userEntityRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.USER_ALREADY_EXIST);
      });

      return this.selectOne({ id }, { loadEagerRelations: true });
    });
  }

  /**
   *  [description]
   * @param optionsOrConditions
   */
  public find(optionsOrConditions?: FindManyOptions<UserEntity>): SelectQueryBuilder<UserEntity> {
    const metadata = this.userEntityRepository.metadata;
    const qb = this.userEntityRepository.createQueryBuilder(
      FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name,
    );

    if (
      !FindOptionsUtils.isFindManyOptions(optionsOrConditions) ||
      optionsOrConditions.loadEagerRelations !== false
    ) {
      FindOptionsUtils.joinEagerRelations(qb, qb.alias, metadata);

      /**
       * Place for common relation
       * @example qb.leftJoinAndSelect('UserEntity.relation_field', 'UserEntity_relation_field')
       */
    }

    return FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions);
  }

  /**
   * [description]
   * @param options
   */
  public async selectAll(
    options: FindManyOptions<UserEntity> = { loadEagerRelations: false },
  ): Promise<UserEntity[]> {
    const qb = this.find(classToPlain(options));
    if (options.where) qb.where(options.where);
    return qb.getMany().catch(() => {
      throw new NotFoundException(ErrorTypeEnum.USERS_NOT_FOUND);
    });
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  public async selectOne(
    conditions: FindConditions<UserEntity>,
    options: FindOneOptions<UserEntity> = { loadEagerRelations: false },
  ): Promise<UserEntity> {
    return this.find(classToPlain(options))
      .where(conditions)
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.USER_NOT_FOUND);
      });
  }

  /**
   * [description]
   * @param conditions
   * @param entityLike
   * @param options
   */
  public async updateOne(
    conditions: Partial<UserEntity>,
    entityLike: Partial<UserEntity>,
    options: SaveOptions = { transaction: false },
  ): Promise<UserEntity> {
    return this.userEntityRepository.manager.transaction(async () => {
      const mergeIntoEntity = await this.selectOne(conditions);
      const entity = this.userEntityRepository.merge(mergeIntoEntity, entityLike);
      const { id } = await this.userEntityRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.USER_ALREADY_EXIST);
      });

      return this.selectOne({ id }, { loadEagerRelations: true });
    });
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  public async deleteOne(conditions: FindConditions<UserEntity>): Promise<UserEntity> {
    return this.userEntityRepository.manager.transaction(async (transactionalEntityManager) => {
      const entity = await this.selectOne(conditions);
      await transactionalEntityManager
        .delete(UserEntity, conditions)
        .then(({ affected }) => {
          if (!affected) throw new NotFoundException(ErrorTypeEnum.USER_NOT_FOUND);
        })
        .catch(() => {
          throw new NotFoundException(ErrorTypeEnum.USER_NOT_FOUND);
        });
      return entity;
    });
  }
}
