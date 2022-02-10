import { FindOneOptionsDto } from 'src/common/dto';

import { UserEntity } from '../entities';

/**
 * [description]
 */
export class SelectUserDto extends FindOneOptionsDto<UserEntity> {}
