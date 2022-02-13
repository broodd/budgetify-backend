import { MigrationInterface, QueryRunner } from 'typeorm';

import { AccountEntity } from 'src/modules/accounts/entities';

const data: Partial<AccountEntity>[] = [
  {
    id: 'd2727cf0-8631-48ea-98fd-29d7404b1bca',
    name: 'Account',
    balance: 0,
    owner: {
      id: '067f2f3e-b936-4029-93d6-b2f58ae4f489',
    },
  },
];

export class accounts1644744884181 implements MigrationInterface {
  public async up({ connection }: QueryRunner): Promise<void> {
    const userEntityRepository = connection.getRepository(AccountEntity);
    await userEntityRepository.save(data);
  }

  public async down({ connection }: QueryRunner): Promise<void> {
    await connection.getRepository(AccountEntity).delete(data.map(({ id }) => id));
  }
}
