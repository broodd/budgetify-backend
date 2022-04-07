import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import {
  Column,
  Entity,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CurrencyEnum } from 'src/common/enums';

import { UserRefreshTokenEntity } from './user-refresh-token.entity';
import { UserStatusEnum } from '../enums';

/**
 * [description]
 */
@Entity('users')
export class UserEntity {
  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  /**
   * [description]
   */
  @ApiProperty({ enum: UserStatusEnum, default: UserStatusEnum.ACTIVATED })
  @Column({ type: 'enum', enum: UserStatusEnum, default: UserStatusEnum.ACTIVATED })
  public readonly status: UserStatusEnum = UserStatusEnum.ACTIVATED;

  /**
   * [description]
   */
  @ApiProperty({ maxLength: 320, uniqueItems: true })
  @Column({ type: 'varchar', length: 320, unique: true })
  public readonly email: string;

  /**
   * [description]
   */
  @ApiHideProperty()
  @Column({ type: 'varchar', length: 64, select: false })
  public password: string;

  /**
   * [description]
   */
  @ApiProperty({ enum: CurrencyEnum, default: CurrencyEnum.UAH })
  @Column({ type: 'enum', enum: CurrencyEnum, default: CurrencyEnum.UAH })
  public readonly baseCurrency: CurrencyEnum;

  /**
   * [description]
   */
  @BeforeInsert()
  @BeforeUpdate()
  public async hashPassword(): Promise<void> {
    if (!this.password) return;
    this.password = await bcrypt.hash(this.password, 8);
  }

  /**
   * [description]
   */
  @ApiHideProperty()
  @OneToMany(() => UserRefreshTokenEntity, ({ user }) => user, {
    nullable: true,
  })
  public readonly refreshTokens: UserRefreshTokenEntity[];

  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @CreateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public readonly createdAt: Date;

  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @UpdateDateColumn({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public readonly updatedAt: Date;

  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @DeleteDateColumn()
  public readonly deletedAt: Date;
}
