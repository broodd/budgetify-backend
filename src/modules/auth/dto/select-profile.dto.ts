import { FindOneOptionsDto } from 'src/common/dto';
import { UserEntity } from 'src/modules/users/entities';

/**
 * [description]
 */
export class SelectProfileDto extends FindOneOptionsDto<UserEntity> {}
