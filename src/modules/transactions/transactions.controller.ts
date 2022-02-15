import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
  Delete,
  UseGuards,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { User } from 'src/common/decorators';
import { ID } from 'src/common/dto';

import { UserEntity } from '../users/entities';
import { JwtAuthGuard } from '../auth/guards';

import {
  CreateTransactionDto,
  UpdateTransactionDto,
  SelectTransactionsDto,
  PaginationTransactionsDto,
} from './dto';
import { TransactionsService } from './transactions.service';
import { TransactionEntity } from './entities';

/**
 * [description]
 */
@ApiBearerAuth()
@ApiTags('transactions')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class TransactionsController {
  /**
   * [description]
   * @param transactionsService
   */
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * [description]
   * @param data
   */
  @Post()
  public async createOne(
    @Body() data: CreateTransactionDto,
    @User() owner: UserEntity,
  ): Promise<TransactionEntity> {
    return this.transactionsService.createOne({ ...data, owner });
  }

  /**
   * [description]
   * @param options
   */
  @Get()
  public async selectAll(
    @Query() options: SelectTransactionsDto,
    @User() owner: UserEntity,
  ): Promise<PaginationTransactionsDto> {
    return this.transactionsService.selectAll(options, owner);
  }

  /**
   * [description]
   * @param conditions
   * @param data
   */
  @Patch(':id')
  public async updateOne(
    @Param() conditions: ID,
    @Body() data: UpdateTransactionDto,
    @User() owner: UserEntity,
  ): Promise<TransactionEntity> {
    return this.transactionsService.updateOne({ ...conditions, owner }, data);
  }

  /**
   * [description]
   * @param conditions
   */
  @Delete(':id')
  public async deleteOne(
    @Param() conditions: ID,
    @User() owner: UserEntity,
  ): Promise<TransactionEntity> {
    return this.transactionsService.deleteOne({ ...conditions, owner });
  }
}
