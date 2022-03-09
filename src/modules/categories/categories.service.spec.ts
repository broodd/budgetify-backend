import { ConflictException, NotFoundException } from '@nestjs/common';
import { plainToClassFromExist } from 'class-transformer';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ErrorTypeEnum } from 'src/common/enums';
import { DatabaseModule } from 'src/database';
import { ConfigModule } from 'src/config';

import { SelectCategoriesDto } from './dto';
import { CategoryEntity, CategoryTypeEnum } from './entities';

import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  const expected = {
    id: 'd2727cf0-8631-48ea-98fd-29d7404b1bd2',
    name: 'Category',
    icon: 'icon',
    color: 'icon',
    type: CategoryTypeEnum.INCOME,
    owner: {
      id: '067f2f3e-b936-4029-93d6-b2f58ae4f489',
    },
  } as CategoryEntity;

  let service: CategoriesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([CategoryEntity]), ConfigModule, DatabaseModule],
      providers: [CategoriesService],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOne', () => {
    it('should be return category entity', async () => {
      const received = await service.createOne(expected);
      expect(received).toBeInstanceOf(CategoryEntity);
      expect(received.id).toEqual(expected.id);
    });

    it('should be return conflict exception', async () => {
      const error = new ConflictException(ErrorTypeEnum.CATEGORY_ALREADY_EXIST);
      return service.createOne(expected).catch((err) => {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('selectAll', () => {
    it('should be return categorys pagination entity', async () => {
      const received = await service.selectAll();
      expect(received).toHaveLength(expect.any(Number));
    });

    it('should be return not found exception', async () => {
      const options = plainToClassFromExist(new SelectCategoriesDto(), { page: -1 });
      const error = new NotFoundException(ErrorTypeEnum.CATEGORIES_NOT_FOUND);
      return service.selectAll(options).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('selectOne', () => {
    it('should be return category entity', async () => {
      const received = await service.selectOne({ id: expected.id });
      expect(received).toBeInstanceOf(CategoryEntity);
      expect(received.id).toEqual(expected.id);
    });

    it('should be return not found exception', async () => {
      const error = new NotFoundException(ErrorTypeEnum.CATEGORY_NOT_FOUND);
      return service.selectOne({ id: '' }).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('updateOne', () => {
    it('should be return category entity', async () => {
      const received = await service.updateOne({ id: expected.id }, { name: 'Category 2' });
      expect(received).toBeInstanceOf(CategoryEntity);
      expect(received.name).not.toEqual(expected.name);
      expect(received.id).toEqual(expected.id);
    });

    it('should be return conflict exception', async () => {
      const error = new NotFoundException(ErrorTypeEnum.CATEGORY_NOT_FOUND);
      return service.updateOne({ id: expected.id }, {}).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });

    it('should be return not found exception', async () => {
      const error = new ConflictException(ErrorTypeEnum.CATEGORY_ALREADY_EXIST);

      jest
        .spyOn(service, 'selectOne')
        .mockImplementationOnce(async () => ({ id: '' } as CategoryEntity));

      return service.updateOne({ id: '' }, { name: null }).catch((err) => {
        expect(err).toBeInstanceOf(ConflictException);
        expect(err).toEqual(error);
      });
    });
  });

  describe('deleteOne', () => {
    it('should be return category entity', async () => {
      const received = await service.deleteOne({ id: expected.id });
      expect(received).toBeInstanceOf(CategoryEntity);
    });

    it('should be return not found exception', async () => {
      const error = new NotFoundException(ErrorTypeEnum.CATEGORY_NOT_FOUND);

      jest.spyOn(service, 'selectOne').mockImplementationOnce(async () => new CategoryEntity());

      return service.deleteOne({ id: '' }).catch((err) => {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err).toEqual(error);
      });
    });
  });
});
