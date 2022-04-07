import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { randomBytes } from 'crypto';
import { hash } from 'bcrypt';
import {
  Repository,
  SaveOptions,
  FindOneOptions,
  FindManyOptions,
  FindOptionsWhere,
  FindOptionsUtils,
  SelectQueryBuilder,
} from 'typeorm';

import { ErrorTypeEnum } from 'src/common/enums';

import { UserRefreshTokenEntity } from '../entities';

/**
 * [description]
 */
@Injectable()
export class UserRefreshTokensService {
  /**
   * [description]
   * @param userRefreshTokenEntityRepository
   */
  constructor(
    @InjectRepository(UserRefreshTokenEntity)
    public readonly userRefreshTokenEntityRepository: Repository<UserRefreshTokenEntity>,
  ) {}

  /**
   * [description]
   * @param entityLike
   * @param options
   */
  public async generateAndCreateOne(
    entityLike: Partial<UserRefreshTokenEntity>,
    options: SaveOptions = { transaction: false },
  ): Promise<UserRefreshTokenEntity> {
    const refreshIdentifier = randomBytes(16).toString('hex');
    const refreshHash = await hash(refreshIdentifier, 8);
    const entity = await this.createOne({ ...entityLike, ppid: refreshHash }, options);
    return { ...entity, ppid: refreshIdentifier };
  }

  /**
   * [description]
   * @param entityLike
   * @param options
   */
  public async createOne(
    entityLike: Partial<UserRefreshTokenEntity>,
    options: SaveOptions = { transaction: false },
  ): Promise<UserRefreshTokenEntity> {
    return this.userRefreshTokenEntityRepository.manager.transaction(async () => {
      const entity = this.userRefreshTokenEntityRepository.create(entityLike);
      return this.userRefreshTokenEntityRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.USER_REFRESH_TOKEN_ALREADY_EXIST);
      });
    });
  }

  /**
   *  [description]
   * @param optionsOrConditions
   */
  public find(
    optionsOrConditions?: FindManyOptions<UserRefreshTokenEntity>,
  ): SelectQueryBuilder<UserRefreshTokenEntity> {
    const metadata = this.userRefreshTokenEntityRepository.metadata;
    return this.userRefreshTokenEntityRepository
      .createQueryBuilder(
        FindOptionsUtils.extractFindManyOptionsAlias(optionsOrConditions) || metadata.name,
      )
      .setFindOptions(optionsOrConditions);
  }

  /**
   * [description]
   * @param options
   */
  public async selectAll(
    options: FindManyOptions<UserRefreshTokenEntity> = { loadEagerRelations: false },
  ): Promise<UserRefreshTokenEntity[]> {
    const qb = this.find(instanceToPlain(options));
    if (options.where) qb.where(options.where);
    return qb.getMany().catch(() => {
      throw new NotFoundException(ErrorTypeEnum.USER_REFRESH_TOKENS_NOT_FOUND);
    });
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  public async selectOne(
    conditions: FindOptionsWhere<UserRefreshTokenEntity>,
    options: FindOneOptions<UserRefreshTokenEntity> = { loadEagerRelations: false },
  ): Promise<UserRefreshTokenEntity> {
    return this.find(instanceToPlain(options))
      .where(conditions)
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException(ErrorTypeEnum.USER_REFRESH_TOKEN_NOT_FOUND);
      });
  }

  /**
   * [description]
   * @param conditions
   * @param entityLike
   * @param options
   */
  public async updateOne(
    conditions: FindOptionsWhere<UserRefreshTokenEntity>,
    entityLike: Partial<UserRefreshTokenEntity>,
    options: SaveOptions = { transaction: false },
  ): Promise<UserRefreshTokenEntity> {
    return this.userRefreshTokenEntityRepository.manager.transaction(async () => {
      const mergeIntoEntity = await this.selectOne(conditions);
      const entity = this.userRefreshTokenEntityRepository.merge(mergeIntoEntity, entityLike);
      return this.userRefreshTokenEntityRepository.save(entity, options).catch(() => {
        throw new ConflictException(ErrorTypeEnum.USER_REFRESH_TOKEN_ALREADY_EXIST);
      });
    });
  }

  /**
   * [description]
   * @param conditions
   * @param options
   */
  public async deleteOne(
    conditions: FindOptionsWhere<UserRefreshTokenEntity>,
  ): Promise<UserRefreshTokenEntity> {
    return this.userRefreshTokenEntityRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const entity = await this.selectOne(conditions);
        await transactionalEntityManager
          .delete(UserRefreshTokenEntity, conditions)
          .then(({ affected }) => {
            if (!affected) throw new NotFoundException(ErrorTypeEnum.USER_REFRESH_TOKEN_NOT_FOUND);
          })
          .catch(() => {
            throw new NotFoundException(ErrorTypeEnum.USER_REFRESH_TOKEN_NOT_FOUND);
          });
        return entity;
      },
    );
  }
}
