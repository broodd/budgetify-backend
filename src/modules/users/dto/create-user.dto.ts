import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * [description]
 */
export class CreateUserDto {
  /**
   * [description]
   */
  @IsEmail()
  @ApiProperty({ example: 'admin@gmail.com', maxLength: 320 })
  public readonly email: string;

  /**
   * [description]
   */
  @MinLength(8)
  @MaxLength(64)
  @ApiProperty({ minLength: 8, maxLength: 64, example: 'password' })
  public readonly password: string;
}
