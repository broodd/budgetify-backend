import { PaginationMixin } from 'src/common/dto';

import { CategoryEntity } from '../entities';

/**
 * [description]
 */
export class PaginationCategoriesDto extends PaginationMixin(CategoryEntity) {
  /**
   * [description]
   * @param result
   * @param count
   */
  constructor([result, count]: [CategoryEntity[], number]) {
    super();
    Object.assign(this, { result, count });
  }
}
