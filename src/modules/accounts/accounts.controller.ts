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

import { CreateAccountDto, UpdateAccountDto, SelectAccountsDto } from './dto';
import { AccountsService } from './accounts.service';
import { AccountEntity } from './entities';

/**
 * [description]
 */
@ApiBearerAuth()
@ApiTags('accounts')
@Controller('accounts')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class AccountsController {
  /**
   * [description]
   * @param accountsService
   */
  constructor(private readonly accountsService: AccountsService) {}

  /**
   * [description]
   * @param data
   */
  @Post()
  public async createOne(
    @Body() data: CreateAccountDto,
    @User() owner: UserEntity,
  ): Promise<AccountEntity> {
    return this.accountsService.createOne({ ...data, owner: { id: owner.id } }, owner);
  }

  /**
   * [description]
   * @param options
   */
  @Get()
  public async selectAll(
    @Query() options: SelectAccountsDto,
    @User() owner: UserEntity,
  ): Promise<AccountEntity[]> {
    return this.accountsService.selectAllWithBaseBalance(owner, options);
  }

  /**
   * [description]
   * @param conditions
   * @param data
   */
  @Patch(':id')
  public async updateOne(
    @Param() conditions: ID,
    @Body() data: UpdateAccountDto,
    @User() owner: UserEntity,
  ): Promise<AccountEntity> {
    return this.accountsService.updateOne({ ...conditions, owner: { id: owner.id } }, owner, data);
  }

  /**
   * [description]
   * @param conditions
   */
  @Delete(':id')
  public async deleteOne(
    @Param() conditions: ID,
    @User() owner: UserEntity,
  ): Promise<AccountEntity> {
    return this.accountsService.deleteOne({ ...conditions, owner: { id: owner.id } }, owner);
  }
}
