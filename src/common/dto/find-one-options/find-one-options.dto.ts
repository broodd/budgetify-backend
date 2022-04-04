import { IsArray, IsString, IsNotEmpty, IsOptional, IsBooleanString } from 'class-validator';
import { FindOneOptions, FindOptionsSelect } from 'typeorm';
import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * [description]
 */
export class FindOneOptionsDto<Entity> implements FindOneOptions {
  /**
   * Specifies what columns should be retrieved
   */
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Transform(({ value }) => [].concat(value))
  @ApiProperty({
    type: [String],
    example: [],
    description: 'Specifies what columns should be retrieved',
  })
  public readonly selection?: [keyof Entity];

  /**
   * Expose field `select`, specifies what columns should be retrieved
   */
  @Expose({ toPlainOnly: true })
  public get select(): FindOptionsSelect<Entity> {
    return Object.assign({}, ...(this.selection?.map((key) => ({ [key]: true })) || []));
  }
}
