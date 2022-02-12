import { CreateUserDto } from '../../users/dto';
import { PickType } from '@nestjs/swagger';

/**
 * [description]
 */
export class SendResetPasswordDto extends PickType(CreateUserDto, ['email']) {}
