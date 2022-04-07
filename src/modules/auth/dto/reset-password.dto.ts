import { CreateUserDto } from '../../users/dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

/**
 * [description]
 */
export class ResetPasswordDto extends PickType(CreateUserDto, ['email', 'password']) {
  /**
   * [description]
   */
  @IsString()
  @Length(6)
  @ApiProperty({ example: '123456', maxLength: 6 })
  public readonly code: string;
}

/**
 * [description]
 */
export class SendResetPasswordDto extends PickType(CreateUserDto, ['email']) {}
