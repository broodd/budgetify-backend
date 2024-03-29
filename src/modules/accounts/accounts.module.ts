import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ExchangeRateModule } from '../exchangerate';

import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { AccountEntity } from './entities';

/**
 * [description]
 */
@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity]), ExchangeRateModule],
  controllers: [AccountsController],
  providers: [AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
