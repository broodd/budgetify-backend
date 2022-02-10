import { PickType } from '@nestjs/swagger';

import { CreateUserDto } from '../../users';

/**
 * [description]
 */
export class CredentialsDto extends PickType(CreateUserDto, ['email', 'password']) {}
