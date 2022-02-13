import { PaginationMixin } from 'src/common/dto';

import { AccountEntity } from '../entities';

/**
 * [description]
 */
export class PaginationAccountsDto extends PaginationMixin(AccountEntity) {
  /**
   * [description]
   * @param result
   * @param count
   */
  constructor([result, count]: [AccountEntity[], number]) {
    super();
    Object.assign(this, { result, count });
  }
}
