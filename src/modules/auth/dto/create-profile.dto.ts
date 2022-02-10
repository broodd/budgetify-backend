import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../../users/dto';

/**
 * [description]
 */
export class CreateProfileDto extends PickType(CreateUserDto, ['password', 'email']) {}
