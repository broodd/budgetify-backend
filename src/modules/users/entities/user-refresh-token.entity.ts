import {
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

import { UserEntity } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity('user_refresh_tokens')
export class UserRefreshTokenEntity {
  /**
   * [description]
   */
  @ApiProperty({ readOnly: true })
  @PrimaryGeneratedColumn('uuid')
  public readonly id: string;

  /**
   * [description]
   */
  @Exclude()
  @ApiHideProperty()
  @Column({ type: 'varchar', length: 64 })
  public ppid: string;

  /**
   * [description]
   */
  @ApiHideProperty()
  @ManyToOne(() => UserEntity, ({ refreshTokens }) => refreshTokens, {
    onDelete: 'CASCADE',
  })
  public readonly user: Partial<UserEntity>;

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
}
