import { MigrationInterface, QueryRunner } from 'typeorm';

import { CategoryEntity, CategoryTypeEnum } from 'src/modules/categories/entities';

const data: Partial<CategoryEntity>[] = [
  {
    id: 'd2727cf0-8631-48ea-98fd-29d7404b1bca',
    name: 'Expense category',
    icon: 'icon',
    color: 'color',
    type: CategoryTypeEnum.EXPENSE,
    owner: {
      id: '067f2f3e-b936-4029-93d6-b2f58ae4f489',
    },
  },
  {
    id: 'd2727cf0-8631-48ea-98fd-29d7404b1d54',
    name: 'Income category',
    icon: 'icon',
    color: 'color',
    type: CategoryTypeEnum.INCOME,
    owner: {
      id: '067f2f3e-b936-4029-93d6-b2f58ae4f489',
    },
  },
];

export class categories1644767124120 implements MigrationInterface {
  public async up({ connection }: QueryRunner): Promise<void> {
    const repository = connection.getRepository(CategoryEntity);
    await repository.save(data).catch();
  }

  public async down({ connection }: QueryRunner): Promise<void> {
    await connection.getRepository(CategoryEntity).delete(data.map(({ id }) => id));
  }
}
