import { FindManyOptionsDto } from 'src/common/dto';

import { TransactionEntity } from '../entities';

/**
 * [description]
 */
export class SelectTransactionsDto extends FindManyOptionsDto<TransactionEntity> {}
