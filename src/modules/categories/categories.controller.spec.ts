import { classToClassFromExist, plainToClass } from 'class-transformer';
import { Test, TestingModule } from '@nestjs/testing';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

import { CategoryEntity } from './entities';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  SelectCategoriesDto,
  PaginationCategoriesDto,
} from './dto';
import { UserEntity } from '../users/entities';

describe('CategoriesController', () => {
  const user = {
    id: '067f2f3e-b936-4029-93d6-b2f58ae4f489',
  } as UserEntity;

  const optionsAll = new SelectCategoriesDto();
  const createOne = new CreateCategoryDto();
  const updateDto = new UpdateCategoryDto();
  const owner = new CategoryEntity();

  let controller: CategoriesController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            createOne: (data: Partial<CategoryEntity>) => classToClassFromExist(data, owner),
            selectAll: () => new PaginationCategoriesDto([[owner], 1]),
            selectOne: () => new CategoryEntity(),
            updateOne: (owner: CategoryEntity, data: Partial<CategoryEntity>) =>
              plainToClass(CategoryEntity, { ...owner, ...data }),
            deleteOne: () => new CategoryEntity(),
          },
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOne', () => {
    it('should be return category entity', async () => {
      const received = await controller.createOne(createOne, user);
      expect(received).toBeInstanceOf(CategoryEntity);
    });
  });

  describe('selectAll', () => {
    it('should be return category entity', async () => {
      const received = await controller.selectAll(optionsAll, user);
      expect(received).toBeInstanceOf(PaginationCategoriesDto);
    });
  });

  describe('updateOne', () => {
    it('should be return category entity', async () => {
      const entityLike = classToClassFromExist(owner, updateDto);
      const received = await controller.updateOne(owner, entityLike, user);
      expect(received).toBeInstanceOf(CategoryEntity);
    });
  });

  describe('deleteOne', () => {
    it('should be return category entity', async () => {
      const received = await controller.deleteOne(owner, user);
      expect(received).toBeInstanceOf(CategoryEntity);
    });
  });
});
