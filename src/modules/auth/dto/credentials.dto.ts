import { PickType } from '@nestjs/swagger';

import { CreateUserDto } from '../../users/dto';

/**
 * [description]
 */
export class CredentialsDto extends PickType(CreateUserDto, ['email', 'password']) {}
