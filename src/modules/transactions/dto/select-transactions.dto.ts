import { ArrayMaxSize, ArrayMinSize, IsDate, IsEnum, IsOptional } from 'class-validator';
import { Between, Brackets, FindManyOptions, In } from 'typeorm';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

import { FindManyOptionsDto } from 'src/common/dto';

import { TransactionEntity, TransactionTypeEnum } from '../entities';

/**
 * [description]
 */
export class SelectTransactionsDto extends FindManyOptionsDto<TransactionEntity> {
  /**
   * [description]
   */
  @IsOptional()
  @Transform(({ value }) => [].concat(value))
  @IsEnum(TransactionTypeEnum, { each: true })
  @ArrayMaxSize(Object.values(TransactionTypeEnum).length)
  @ApiPropertyOptional({ example: Object.values(TransactionTypeEnum) })
  public readonly types?: TransactionTypeEnum[];

  /**
   * [description]
   */
  @IsOptional()
  @IsDate({ each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Type(() => Date)
  @ApiPropertyOptional({ example: [new Date(), new Date()] })
  public readonly date?: [Date, Date];

  /**
   * [description]
   */
  @IsOptional()
  @Transform(({ value }) => [].concat(value))
  @ApiPropertyOptional({ type: () => [String], example: ['d2727cf0-8631-48ea-98fd-29d7404b1bca'] })
  public readonly categories?: string[];

  /**
   * [description]
   */
  @IsOptional()
  @Transform(({ value }) => [].concat(value))
  @ApiPropertyOptional({ type: () => [String], example: ['d2727cf0-8631-48ea-98fd-29d7404b1bca'] })
  public readonly accounts?: string[];

  /**
   * [description]
   */
  public get where(): FindManyOptions['where'] {
    const { date, types, categories, accounts } = this;

    return new Brackets((qb) => {
      qb.where(
        Object.assign(
          {},
          date && { date: Between(...date) },
          types && { type: In(types) },
          categories?.length && { category: In(categories) },
          accounts?.length && { account: In(accounts) },
        ),
      );
    });
  }
}
