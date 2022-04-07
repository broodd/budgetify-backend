import { ApiProperty, PickType } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';
import { UpdateUserDto } from '../../users/dto';

/**
 * [description]
 */
export class UpdateProfileDto extends UpdateUserDto {}

/**
 * [description]
 */
export class UpdateEmailDto extends PickType(UpdateUserDto, ['email', 'password']) {}

/**
 * [description]
 */
export class UpdatePasswordDto extends PickType(UpdateUserDto, ['password']) {
  /**
   * [description]
   */
  @MinLength(8)
  @MaxLength(64)
  @ApiProperty({ minLength: 8, maxLength: 64, example: 'password' })
  public readonly oldPassword: string;
}
