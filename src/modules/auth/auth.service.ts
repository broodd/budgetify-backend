import { BadRequestException, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { FindConditions } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';

import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

import { ErrorTypeEnum } from 'src/common/enums';
import { SendGridService } from 'src/sendgrid';

import { UserEntity } from '../users/entities';
import { UsersService } from '../users';

import {
  CredentialsDto,
  JwtResponseDto,
  UpdateEmailDto,
  CreateProfileDto,
  ResetPasswordDto,
  UpdatePasswordDto,
  SendResetPasswordDto,
  ConfirmationEmailDto,
} from './dto';

/**
 * [description]
 */
@Injectable()
export class AuthService {
  /**
   * [description]
   * @param configService
   * @param usersService
   * @param jwtService
   */
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly sendGridService: SendGridService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * [description]
   * @param id
   */
  public generateToken({ id }: UserEntity): JwtResponseDto {
    const token = this.jwtService.sign({ id });
    return { token };
  }

  /**
   * [description]
   * @param digits
   * @param size
   */
  public generateCode(digits = 6, size = 20): string {
    const buffer = crypto.randomBytes(size);
    const value = buffer.readUInt32BE(0x0f) % 10 ** digits;
    return value.toString().padStart(digits, '0');
  }

  /**
   * [description]
   * @param email
   * @param password
   */
  public async createToken({ email, password }: CredentialsDto): Promise<JwtResponseDto> {
    const user = await this.validateUser({ email });
    if (!(await this.validatePassword(password, user.password)))
      throw new BadRequestException(ErrorTypeEnum.AUTH_INCORRECT_CREDENTIALS);
    return this.generateToken(user);
  }

  /**
   * [description]
   * @param data
   */
  public async createUser(data: CreateProfileDto): Promise<JwtResponseDto> {
    const user = await this.usersService.createOne(data);
    return this.generateToken(user);
  }

  /**
   * [description]
   * @param data
   */
  public async validateUser(conditions: FindConditions<UserEntity>): Promise<UserEntity> {
    return this.usersService
      .selectOne(conditions, {
        loadEagerRelations: false,
        select: ['id', 'password', 'baseCurrency'],
      })
      .catch(() => {
        throw new BadRequestException(ErrorTypeEnum.AUTH_INCORRECT_CREDENTIALS);
      });
  }

  /**
   * [description]
   * @param data
   * @param encrypted
   */
  public async validatePassword(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted).catch(() => {
      throw new BadRequestException(ErrorTypeEnum.AUTH_PASSWORDS_DO_NOT_MATCH);
    });
  }

  /**
   * [description]
   * @param data
   */
  public async confirmationEmailCode(data: ConfirmationEmailDto): Promise<Partial<UserEntity>> {
    const { code, email } = data;
    const user = await this.usersService.selectOne(
      { email },
      { loadEagerRelations: false, select: ['id', 'password'] },
    );

    const cacheCode = await this.cacheManager.get<string>(user.id);
    if (cacheCode !== code)
      throw new BadRequestException(ErrorTypeEnum.AUTH_INCORRECT_CONFIRMATION_EMAIL_CODE);

    return user;
  }

  /**
   * [description]
   * @param data
   */
  public async sendResetPassword(data: SendResetPasswordDto): Promise<void> {
    const { id } = await this.usersService.selectOne(data, {
      loadEagerRelations: false,
      select: ['id'],
    });

    const code = this.generateCode();
    this.cacheManager.set<string>(id, code);

    await this.sendGridService.sendMail({
      to: data.email,
      subject: 'Забули свій пароль?',
      text: `Код для скидання паролю: ${code}`,
      html: `Код для скидання паролю: <b>${code}</b>`,
    });
  }

  /**
   * [description]
   * @param data
   */
  public async resetPassword(data: ResetPasswordDto): Promise<void> {
    const { id, password } = await this.confirmationEmailCode(data);

    if (await this.validatePassword(data.password, password))
      throw new BadRequestException(ErrorTypeEnum.NEW_PASSWORD_AND_OLD_PASSWORD_CANNOT_BE_SAME);

    await this.cacheManager.del(id);
    await this.usersService.updateOne({ id }, { password: data.password });
  }

  /**
   * [description]
   * @param data
   */
  public async updatePassword(
    data: UpdatePasswordDto,
    user: Partial<UserEntity>,
  ): Promise<UserEntity> {
    if (!(await this.validatePassword(data.oldPassword, user.password)))
      throw new BadRequestException(ErrorTypeEnum.AUTH_PASSWORDS_DO_NOT_MATCH);
    return this.usersService.updateOne(user, { password: data.password });
  }

  /**
   * [description]
   * @param data
   */
  public async updateEmail(data: UpdateEmailDto, user: Partial<UserEntity>): Promise<UserEntity> {
    if (!(await this.validatePassword(data.password, user.password)))
      throw new BadRequestException(ErrorTypeEnum.AUTH_PASSWORDS_DO_NOT_MATCH);
    return this.usersService.updateOne(user, { email: data.email });
  }
}
