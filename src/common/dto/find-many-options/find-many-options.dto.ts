import { IsArray, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { FindManyOptions } from 'typeorm';

import { FindOneOptionsDto } from '../find-one-options';
import { dotNotation } from 'src/common/helpers';

/**
 * [description]
 */
export class FindManyOptionsDto<Entity>
  extends FindOneOptionsDto<Entity>
  implements FindManyOptions
{
  /**
   * Order, in which entities should be ordered
   */
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Transform(({ value }) => [].concat(value))
  @ApiProperty({
    type: [String],
    description: `Order, in which entities should be ordered. For order by relation field use <i>elation.field</i>`,
  })
  public readonly asc?: string[];

  /**
   * If the same fields are specified for sorting in two directions, the priority is given to DESC
   */
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Transform(({ value }) => [].concat(value))
  @ApiProperty({
    type: [String],
    description:
      'If the same fields are specified for sorting in two directions, the priority is given to DESC',
  })
  public readonly desc?: string[];

  /**
   * Getter to form an object of order. Available after calling instanceToPlain
   */
  @Expose({ toPlainOnly: true })
  public get order(): FindManyOptions['order'] {
    return Object.assign(
      {},
      dotNotation(this.asc || [], 'ASC'),
      dotNotation(this.desc || [], 'DESC'),
    );
  }
}
