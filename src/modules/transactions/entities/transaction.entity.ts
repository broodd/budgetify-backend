import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CurrencyEnum } from 'src/common/enums';
import { FloatIntColumnTransformer } from 'src/database/transformers';

import { UserEntity } from 'src/modules/users/entities';
import { AccountEntity } from 'src/modules/accounts/entities';
import { CategoryEntity } from 'src/modules/categories/entities';

export enum TransactionTypeEnum {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
}

/**
 * [description]
 */
@Entity('transactions')
export class TransactionEntity {
  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  /**
   * [description]
   */
  @ApiProperty({ enum: TransactionTypeEnum, nullable: false })
  @Column({ type: 'enum', enum: TransactionTypeEnum, nullable: false })
  public readonly type: TransactionTypeEnum;

  /**
   * [description]
   */
  @ApiProperty()
  @Column({
    type: 'bigint',
    nullable: false,
    transformer: FloatIntColumnTransformer,
  })
  public readonly amount: number;

  /**
   * [description]
   */
  @ApiProperty()
  @Column({
    type: 'bigint',
    nullable: true,
    transformer: FloatIntColumnTransformer,
  })
  public readonly amountInAnotherCurrency: number;

  /**
   * [description]
   */
  @ApiProperty({ maxLength: 256, nullable: true })
  @Column({ type: 'varchar', length: 256, nullable: true })
  public readonly description: string;

  /**
   * [description]
   */
  @ApiProperty({ enum: CurrencyEnum, nullable: true })
  @Column({ type: 'enum', enum: CurrencyEnum, nullable: true })
  public readonly currencyCode: CurrencyEnum;

  /**
   * [description]
   */
  @ApiProperty({ type: () => CategoryEntity, nullable: true })
  @ManyToOne(() => CategoryEntity, {
    onDelete: 'CASCADE',
    nullable: true,
    eager: true,
  })
  @JoinColumn()
  public readonly category: Partial<CategoryEntity>;

  /**
   * [description]
   */
  @ApiProperty({ type: () => AccountEntity, nullable: false })
  @ManyToOne(() => AccountEntity, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn()
  public readonly account: Partial<AccountEntity>;

  /**
   * [description]
   */
  @ApiHideProperty()
  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn()
  public readonly owner: Partial<UserEntity>;

  /**
   * [description]
   */
  @ApiProperty()
  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', nullable: false })
  public readonly date: Date;

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
