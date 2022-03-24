import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  MaxLength,
  MinLength,
  IsOptional,
  IsPositive,
  ValidateNested,
  ValidateIf,
} from 'class-validator';

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
  @ApiProperty({ enum: CreateTransactionType, examples: CreateTransactionType })
  public readonly type: TransactionTypeEnum;

  /**
   * [description]
   */
  @ValidateIf((o, value) => value || !o.currencyCode)
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiProperty({ example: 1 })
  public readonly amount: number;

  /**
   * [description]
   */
  @ValidateIf((o) => o.currencyCode)
  @IsPositive()
  @IsNumber({ maxDecimalPlaces: 2 })
  @ApiPropertyOptional({ example: 1 })
  public readonly amountInAnotherCurrency?: number;

  /**
   * [description]
   */
  @ValidateIf((o) => o.amountInAnotherCurrency)
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
