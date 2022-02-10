import { PartialType } from '@nestjs/swagger';

import { CreateUserDto } from './create-user.dto';

/**
 * [description]
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
