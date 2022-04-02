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

import { UserEntity } from 'src/modules/users/entities';

export enum CategoryTypeEnum {
  EXPENSE = 'EXPENSE',
  INCOME = 'INCOME',
}

/**
 * [description]
 */
@Entity('categories')
export class CategoryEntity {
  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  /**
   * [description]
   */
  @ApiProperty({ enum: CategoryTypeEnum, nullable: false })
  @Column({ type: 'enum', enum: CategoryTypeEnum, nullable: false })
  public readonly type: CategoryTypeEnum;

  /**
   * [description]
   */
  @ApiProperty({ maxLength: 64, nullable: false })
  @Column({ type: 'varchar', length: 64, nullable: false })
  public readonly name: string;

  /**
   * [description]
   */
  @ApiProperty({ maxLength: 32, nullable: true })
  @Column({ type: 'varchar', length: 32, nullable: true })
  public readonly icon: string;

  /**
   * [description]
   */
  @ApiProperty({ maxLength: 32, nullable: true })
  @Column({ type: 'varchar', length: 32, nullable: true })
  public readonly color: string;

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
