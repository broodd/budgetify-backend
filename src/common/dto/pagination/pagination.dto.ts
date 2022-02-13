import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

/**
 * [description]
 * @param classRef
 * @constructor
 */
export function PaginationMixin<Entity>(classRef: Type<Entity>): any {
  abstract class Pagination {
    /**
     * Result of the selection by the specified parameters.
     */
    @ApiProperty({ type: classRef, isArray: true })
    public readonly result: Entity[];

    /**
     * Total number of records.
     */
    @ApiProperty()
    public readonly count: number;
  }

  return Pagination;
}
