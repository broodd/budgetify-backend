import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { AccountEntity } from '../accounts/entities';
import { CategoriesModule } from '../categories';
import { AccountsModule } from '../accounts';

import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { TransactionEntity } from './entities';

/**
 * [description]
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity, AccountEntity]),
    CategoriesModule,
    AccountsModule,
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
