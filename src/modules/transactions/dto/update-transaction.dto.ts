import { PartialType } from '@nestjs/swagger';

import { CreateTransactionDto } from './create-transaction.dto';

/**
 * [description]
 */
export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
