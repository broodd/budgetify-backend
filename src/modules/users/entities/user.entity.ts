import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import {
  Column,
  Entity,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CurrencyEnum } from 'src/common/enums';

/**
 * [description]
 */
@Entity('users')
export class UserEntity extends BaseEntity {
  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

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
  @ApiProperty({ readOnly: true })
  @CreateDateColumn({
    readonly: true,
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public readonly createdAt: Date;

  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @UpdateDateColumn({
    readonly: true,
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public readonly updatedAt: Date;
}
