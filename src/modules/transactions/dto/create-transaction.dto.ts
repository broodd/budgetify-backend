import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
  NotEquals,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { ID } from 'src/common/dto';

import { TransactionTypeEnum } from '../entities';

/**
 * [description]
 */
export class CreateTransactionDto {
  /**
   * [description]
   */
  @IsEnum(TransactionTypeEnum)
  @ApiProperty({ enum: TransactionTypeEnum, examples: TransactionTypeEnum })
  public readonly type: TransactionTypeEnum;

  /**
   * [description]
   */
  @IsNumber({ maxDecimalPlaces: 2 })
  @NotEquals(0)
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
  @ValidateIf((o) => o.type !== TransactionTypeEnum.TRANSFER || o.category)
  @ValidateNested()
  @Type(() => ID)
  @ApiPropertyOptional({ type: ID })
  public readonly category?: ID;

  /**
   * [description]
   */
  @ValidateNested()
  @Type(() => ID)
  @ApiProperty({ type: ID })
  public readonly account: ID;

  /**
   * [description]
   */
  @ValidateIf((o) => o.type === TransactionTypeEnum.TRANSFER || o.toTransferAccount)
  @ValidateNested()
  @Type(() => ID)
  @ApiPropertyOptional({ type: ID })
  public readonly toTransferAccount?: ID;
}
