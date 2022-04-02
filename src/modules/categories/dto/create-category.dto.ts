import { IsEnum, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryTypeEnum } from '../entities';

/**
 * [description]
 */
export class CreateCategoryDto {
  /**
   * [description]
   */
  @IsEnum(CategoryTypeEnum)
  @ApiProperty({ enum: CategoryTypeEnum })
  public readonly type: CategoryTypeEnum;

  /**
   * [description]
   */
  @MinLength(1)
  @MaxLength(64)
  @ApiProperty({ example: 'Category' })
  public readonly name: string;

  /**
   * [description]
   */
  @IsOptional()
  @MinLength(1)
  @MaxLength(32)
  @ApiPropertyOptional({ example: 'icon' })
  public readonly icon?: string;

  /**
   * [description]
   */
  @IsOptional()
  @MinLength(1)
  @MaxLength(32)
  @ApiPropertyOptional({ example: 'color' })
  public readonly color?: string;
}
