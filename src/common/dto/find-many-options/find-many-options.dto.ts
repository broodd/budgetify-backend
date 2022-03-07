import { Min, Max, IsArray, IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { FindManyOptions } from 'typeorm';

import { FindOneOptionsDto } from '../find-one-options';

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
    example: ['id'],
    description: 'Order, in which entities should be ordered.',
  })
  public readonly asc?: string[];

  /**
   * By default: ID
   * If the same fields are specified for sorting in two directions, the priority is given to DESC
   */
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Transform(({ value }) => [].concat(value))
  @ApiProperty({
    type: [String],
    example: ['id'],
    default: ['id'],
    description:
      'If the same fields are specified for sorting in two directions, the priority is given to DESC',
  })
  public readonly desc?: [keyof Entity];

  /**
   * Getter to form an object of order. Available after calling classToPlain
   */
  @Expose({ toPlainOnly: true })
  public get order(): FindManyOptions['order'] {
    return Object.assign(
      {},
      ...(this.asc?.map((key) => ({ [key]: 'ASC' })) || [{ id: 'DESC' }]),
      ...(this.desc?.map((key) => ({ [key]: 'DESC' })) || []),
    );
  }
}
