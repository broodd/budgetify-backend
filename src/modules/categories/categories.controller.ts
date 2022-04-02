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

import { CreateCategoryDto, UpdateCategoryDto, SelectCategoriesDto } from './dto';
import { CategoriesService } from './categories.service';
import { CategoryEntity } from './entities';

/**
 * [description]
 */
@ApiBearerAuth()
@ApiTags('categories')
@Controller('categories')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CategoriesController {
  /**
   * [description]
   * @param categoriesService
   */
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * [description]
   * @param data
   */
  @Post()
  public async createOne(
    @Body() data: CreateCategoryDto,
    @User() owner: UserEntity,
  ): Promise<CategoryEntity> {
    return this.categoriesService.createOne({ ...data, owner });
  }

  /**
   * [description]
   * @param options
   */
  @Get()
  public async selectAll(
    @Query() options: SelectCategoriesDto,
    @User() owner: UserEntity,
  ): Promise<CategoryEntity[]> {
    return this.categoriesService.selectAll(options, owner);
  }

  /**
   * [description]
   * @param conditions
   * @param data
   */
  @Patch(':id')
  public async updateOne(
    @Param() conditions: ID,
    @Body() data: UpdateCategoryDto,
    @User() owner: UserEntity,
  ): Promise<CategoryEntity> {
    return this.categoriesService.updateOne({ ...conditions, owner: { id: owner.id } }, data);
  }

  /**
   * [description]
   * @param conditions
   */
  @Delete(':id')
  public async deleteOne(
    @Param() conditions: ID,
    @User() owner: UserEntity,
  ): Promise<CategoryEntity> {
    return this.categoriesService.deleteOne({ ...conditions, owner: { id: owner.id } });
  }
}
