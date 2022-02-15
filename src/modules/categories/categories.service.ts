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

import { PaginationCategoriesDto } from './dto';
import { CategoryEntity } from './entities';
import { UserEntity } from '../users/entities';

/**
 * [description]
 */
@Injectable()
export class CategoriesService {
  /**
   * [description]
   * @param categoryEntityRepository
   */
  constructor(
    @InjectRepository(CategoryEntity)
    public readonly categoryEntityRepository: Repository<CategoryEntity>,
  ) {}

  /**
   * [description]
   * @param entityLike
   * @param options
   */
  public async createOne(
    entityLike: Partial<CategoryEntity>,
    options: SaveOptions = { transaction: false },
  ): Promise<CategoryEntity> {
    return this.categoryEntityRepository.manager.transaction(async () => {
      const entity = this.categoryEntityRepository.create(entityLike);
      const { id } = await this.categoryEntityRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.CATEGORY_ALREADY_EXIST);
      });

      return this.selectOne({ id }, { loadEagerRelations: true });
    });
  }

  /**
   *  [description]
   * @param optionsOrConditions
   */
  public find(
    optionsOrConditions?: FindManyOptions<CategoryEntity>,
  ): SelectQueryBuilder<CategoryEntity> {
    const metadata = this.categoryEntityRepository.metadata;
    const qb = this.categoryEntityRepository.createQueryBuilder(
      FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name,
    );

    if (
      !FindOptionsUtils.isFindManyOptions(optionsOrConditions) ||
      optionsOrConditions.loadEagerRelations !== false
    ) {
      FindOptionsUtils.joinEagerRelations(qb, qb.alias, metadata);

      /**
       * Place for common relation
       * @example qb.leftJoinAndSelect('CategoryEntity.relation_field', 'CategoryEntity_relation_field')
       */
    }

    return FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, optionsOrConditions);
  }

  /**
   * [description]
   * @param options
   */
  public async selectAll(
    options: FindManyOptions<CategoryEntity> = { loadEagerRelations: false },
    owner?: Partial<UserEntity>,
  ): Promise<PaginationCategoriesDto> {
    const qb = this.find(classToPlain(options));
    if (options.where) qb.where(options.where);
    if (owner) qb.andWhere({ owner });

    return qb
      .getManyAndCount()
      .then((data) => new PaginationCategoriesDto(data))
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.CATEGORIES_NOT_FOUND);
      });
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  public async selectOne(
    conditions: FindConditions<CategoryEntity>,
    options: FindOneOptions<CategoryEntity> = { loadEagerRelations: false },
  ): Promise<CategoryEntity> {
    return this.find(classToPlain(options))
      .where(conditions)
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.CATEGORY_NOT_FOUND);
      });
  }

  /**
   * [description]
   * @param conditions
   * @param entityLike
   * @param options
   */
  public async updateOne(
    conditions: Partial<CategoryEntity>,
    entityLike: Partial<CategoryEntity>,
    options: SaveOptions = { transaction: false },
  ): Promise<CategoryEntity> {
    return this.categoryEntityRepository.manager.transaction(async () => {
      const mergeIntoEntity = await this.selectOne(conditions);
      const entity = this.categoryEntityRepository.merge(mergeIntoEntity, entityLike);
      const { id } = await this.categoryEntityRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.CATEGORY_ALREADY_EXIST);
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
    conditions: FindConditions<CategoryEntity>,
    options: RemoveOptions = { transaction: false },
  ): Promise<CategoryEntity> {
    return this.categoryEntityRepository.manager.transaction(async () => {
      const entity = await this.selectOne(conditions);
      return this.categoryEntityRepository.remove(entity, options).catch(() => {
        throw new NotFoundException(ErrorTypeEnum.CATEGORY_NOT_FOUND);
      });
    });
  }
}
