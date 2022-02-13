import { MigrationInterface, QueryRunner } from 'typeorm';

import { UserEntity } from 'src/modules/users/entities';

const data: Partial<UserEntity>[] = [
  {
    id: '067f2f3e-b936-4029-93d6-b2f58ae4f489',
    email: 'admin@gmail.com',
    password: '$2b$08$S7ozpKBRFWdaC0WJRZi3wunHwbZZdK4Chx3Ea.2aZTSL0VebkhPO.', // password
  },
];

export class user1615673396368 implements MigrationInterface {
  public async up({ connection }: QueryRunner): Promise<void> {
    const repository = connection.getRepository(UserEntity);
    await repository.save(data);
  }

  public async down({ connection }: QueryRunner): Promise<void> {
    await connection.getRepository(UserEntity).delete(data.map(({ id }) => id));
  }
}
