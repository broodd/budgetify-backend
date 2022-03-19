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

import { CurrencyEnum } from 'src/common/enums';
import { FloatIntColumnTransformer } from 'src/database/transformers';

import { UserEntity } from 'src/modules/users/entities';

/**
 * [description]
 */
@Entity('accounts')
export class AccountEntity extends BaseEntity {
  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  /**
   * [description]
   */
  @ApiProperty({ maxLength: 64, nullable: false })
  @Column({ type: 'varchar', length: 64, nullable: false })
  public readonly name: string;

  /**
   * [description]
   */
  @ApiProperty({ enum: CurrencyEnum, default: CurrencyEnum.UAH })
  @Column({ type: 'enum', enum: CurrencyEnum, default: CurrencyEnum.UAH })
  public readonly currencyCode: CurrencyEnum;

  /**
   * [description]
   */
  @ApiProperty()
  @Column({
    type: 'bigint',
    nullable: false,
    transformer: FloatIntColumnTransformer,
  })
  public readonly balance: number;

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
