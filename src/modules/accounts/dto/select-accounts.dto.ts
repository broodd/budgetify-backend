import { FindManyOptionsDto } from 'src/common/dto';

import { AccountEntity } from '../entities';

/**
 * [description]
 */
export class SelectAccountsDto extends FindManyOptionsDto<AccountEntity> {}
