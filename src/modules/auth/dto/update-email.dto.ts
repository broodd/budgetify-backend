import { PickType } from '@nestjs/swagger';
import { UpdateUserDto } from '../../users';

/**
 * [description]
 */
export class UpdateEmailDto extends PickType(UpdateUserDto, ['email', 'password']) {}
