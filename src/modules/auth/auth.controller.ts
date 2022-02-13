import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { User } from 'src/common/decorators';

import { UserEntity } from '../users/entities';
import { UsersService } from '../users';

import {
  JwtResponseDto,
  CredentialsDto,
  CreateProfileDto,
  SelectProfileDto,
  ResetPasswordDto,
  SendResetPasswordDto,
  ConfirmationEmailDto,
} from './dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards';

/**
 * [description]
 */
@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  /**
   * [description]
   * @param usersService
   * @param authService
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  /**
   * [description]
   * @param data
   */
  @Post('signin')
  public async createToken(@Body() data: CredentialsDto): Promise<JwtResponseDto> {
    return this.authService.createToken(data);
  }

  /**
   * [description]
   * @param data
   */
  @Post('signup')
  public async createUser(@Body() data: CreateProfileDto): Promise<JwtResponseDto> {
    return this.authService.createUser(data);
  }

  /**
   * [description]
   * @param data
   */
  @Post('send-reset-password')
  public async sendResetPassword(@Body() data: SendResetPasswordDto): Promise<void> {
    return this.authService.sendResetPassword(data);
  }

  /**
   * [description]
   * @param data
   */
  @Post('reset-password')
  public async resetPassword(@Body() data: ResetPasswordDto): Promise<void> {
    return this.authService.resetPassword(data);
  }

  /**
   * [description]
   * @param data
   */
  @Post('confirmation-email-code')
  public async confirmationEmail(@Body() data: ConfirmationEmailDto): Promise<void> {
    await this.authService.confirmationEmailCode(data);
  }

  /**
   * [description]
   * @param id
   * @param options
   */
  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  public async selectUser(
    @User() { id }: UserEntity,
    @Query() options: SelectProfileDto,
  ): Promise<UserEntity> {
    return this.usersService.selectOne({ id }, options);
  }
}
