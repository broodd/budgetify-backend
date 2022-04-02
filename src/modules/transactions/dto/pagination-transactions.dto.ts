import { PaginationMixin } from 'src/common/dto';

import { TransactionEntity } from '../entities';

/**
 * [description]
 */
export class PaginationTransactionsDto extends PaginationMixin(TransactionEntity) {
  /**
   * [description]
   * @param result
   * @param count
   */
  constructor([result, count]: [TransactionEntity[], number]) {
    super();
    Object.assign(this, { result, count });
  }
}
