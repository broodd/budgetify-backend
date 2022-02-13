import { PartialType } from '@nestjs/swagger';

import { CreateAccountDto } from './create-account.dto';

/**
 * [description]
 */
export class UpdateAccountDto extends PartialType(CreateAccountDto) {}
