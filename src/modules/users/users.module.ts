import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UserRefreshTokensService, UsersService } from './services';
import { UserEntity, UserRefreshTokenEntity } from './entities';

/**
 * [description]
 */
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserRefreshTokenEntity])],
  providers: [UsersService, UserRefreshTokensService],
  exports: [UsersService, UserRefreshTokensService],
})
export class UsersModule {}
