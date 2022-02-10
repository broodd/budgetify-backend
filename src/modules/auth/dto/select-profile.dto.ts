import { FindOneOptionsDto } from 'src/common/dto';

import { UserEntity } from '../../users/entities';

/**
 * [description]
 */
export class SelectProfileDto extends FindOneOptionsDto<UserEntity> {}
