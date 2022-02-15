import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  BaseEntity,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from 'src/modules/users/entities';
import { AccountEntity } from 'src/modules/accounts/entities';
import { CategoryEntity } from 'src/modules/categories/entities';

export enum TransactionTypeEnum {
  TRANSFER = 'TRANSFER',
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
}

/**
 * [description]
 */
@Entity('transactions')
export class TransactionEntity extends BaseEntity {
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
  @Column({ type: 'float', nullable: false })
  public readonly amount: number;

  /**
   * [description]
   */
  @ApiProperty({ maxLength: 256, nullable: true })
  @Column({ type: 'varchar', length: 256, nullable: true })
  public readonly description: string;

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
  @ApiProperty({ type: () => AccountEntity, nullable: true })
  @ManyToOne(() => AccountEntity, {
    onDelete: 'CASCADE',
    nullable: true,
    eager: true,
  })
  @JoinColumn()
  public readonly toTransferAccount: Partial<AccountEntity>;

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
