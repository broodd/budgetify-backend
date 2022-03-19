import { IsEnum, IsNumber, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { CurrencyEnum } from 'src/common/enums';

/**
 * [description]
 */
export class CreateAccountDto {
  /**
   * [description]
   */
  @MinLength(1)
  @MaxLength(64)
  @ApiProperty({ example: 'Account' })
  public readonly name: string;

  /**
   * [description]
   */
  @IsNumber()
  @ApiProperty({ example: 0 })
  public readonly balance: number;

  /**
   * [description]
   */
  @IsEnum(CurrencyEnum)
  @ApiProperty({ enum: CurrencyEnum })
  public readonly currencyCode: CurrencyEnum;
}
