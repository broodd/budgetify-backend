import {
  IsDate,
  IsEnum,
  IsNumber,
  MaxLength,
  MinLength,
  NotEquals,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams, Type } from 'class-transformer';

import { ID } from 'src/common/dto';

import { TransactionTypeEnum } from '../entities';

enum CreateTransactionType {
  EXPENSE = TransactionTypeEnum.EXPENSE,
  INCOME = TransactionTypeEnum.INCOME,
}

interface AmountTransformParams extends TransformFnParams {
  value: number;
  obj: Partial<CreateTransactionDto>;
}

/**
 * [description]
 */
export class CreateTransactionDto {
  /**
   * [description]
   */
  @IsEnum(CreateTransactionType)
  @ApiProperty({ enum: CreateTransactionType, examples: CreateTransactionType })
  public readonly type: TransactionTypeEnum;

  /**
   * [description]
   */
  @IsNumber({ maxDecimalPlaces: 2 })
  @NotEquals(0)
  @Transform(({ value, obj }: AmountTransformParams) =>
    obj.type === TransactionTypeEnum.EXPENSE ? -Math.abs(value) : Math.abs(value),
  )
  @ApiProperty({ example: 1 })
  public readonly amount: number;

  /**
   * [description]
   */
  @IsDate()
  @ApiProperty({ example: new Date() })
  public readonly date: Date;

  /**
   * [description]
   */
  @IsOptional()
  @MinLength(1)
  @MaxLength(256)
  @ApiPropertyOptional({ example: 'Desciption' })
  public readonly description?: string;

  /**
   * [description]
   */
  @ValidateNested()
  @Type(() => ID)
  @ApiProperty({ type: ID, example: { id: 'd2727cf0-8631-48ea-98fd-29d7404b1bca' } })
  public readonly category: ID;

  /**
   * [description]
   */
  @ValidateNested()
  @Type(() => ID)
  @ApiProperty({ type: ID, example: { id: 'd2727cf0-8631-48ea-98fd-29d7404b1bca' } })
  public readonly account: ID;
}
