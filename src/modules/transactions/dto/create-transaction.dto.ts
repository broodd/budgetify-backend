import { IsDate, IsEnum, IsNumber, IsOptional, IsPositive, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { ID } from 'src/common/dto';
import { CurrencyEnum } from 'src/common/enums';

import { TransactionTypeEnum } from '../entities';

enum CreateTransactionType {
  EXPENSE = TransactionTypeEnum.EXPENSE,
  INCOME = TransactionTypeEnum.INCOME,
}

/**
 * [description]
 */
export class CreateTransactionDto {
  /**
   * [description]
   */
  @IsEnum(CreateTransactionType)
  @ApiProperty({ enum: CreateTransactionType })
  public readonly type: TransactionTypeEnum;

  /**
   * [description]
   */
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiProperty({ example: 1 })
  public readonly amount: number;

  /**
   * [description]
   */
  @IsOptional()
  @IsEnum(CurrencyEnum)
  @ApiPropertyOptional({ enum: CurrencyEnum })
  public readonly currencyCode?: CurrencyEnum;

  /**
   * [description]
   */
  @IsOptional()
  @IsDate()
  @ApiProperty({ example: new Date() })
  public readonly date?: Date;

  /**
   * [description]
   */
  @IsOptional()
  @ApiPropertyOptional({ example: 'Description' })
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
