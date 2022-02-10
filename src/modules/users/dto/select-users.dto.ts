import { FindManyOptionsDto } from 'src/common/dto';

import { UserEntity } from '../entities';

/**
 * [description]
 */
export class SelectUsersDto extends FindManyOptionsDto<UserEntity> {}
