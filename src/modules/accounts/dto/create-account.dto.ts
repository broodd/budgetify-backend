import { IsNumber, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}
