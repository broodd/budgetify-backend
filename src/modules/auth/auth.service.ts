import { BadRequestException, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { FindOneOptions, FindOptionsWhere } from 'typeorm';
import { ConfigService } from 'src/config';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';

import { randomBytes } from 'crypto';
import { compare } from 'bcrypt';

import { ErrorTypeEnum } from 'src/common/enums';
import { SendGridService } from 'src/sendgrid';

import { UserEntity, UserRefreshTokenEntity } from '../users/entities';
import { UserRefreshTokensService, UsersService } from '../users/services';

import {
  JwtTokensDto,
  CredentialsDto,
  UpdateEmailDto,
  CreateProfileDto,
  ResetPasswordDto,
  UpdatePasswordDto,
  SendResetPasswordDto,
  ConfirmationEmailDto,
  JwtAccessTokenPayloadDto,
  JwtRefreshTokenPayloadDto,
} from './dto';

/**
 * [description]
 */
@Injectable()
export class AuthService {
  private readonly expiresInRefreshToken;
  private readonly expiresInAccessToken;
  private readonly secretRefreshToken;
  private readonly secretAccessToken;

  /**
   * [description]
   * @param configService
   * @param usersService
   * @param jwtService
   */
  constructor(
    private readonly userRefreshTokensService: UserRefreshTokensService,
    private readonly sendGridService: SendGridService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {
    this.expiresInRefreshToken = this.configService.get<number>('JWT_EXPIRES_REFRESH_TOKEN');
    this.expiresInAccessToken = this.configService.get<number>('JWT_EXPIRES_ACCESS_TOKEN');
    this.secretRefreshToken = this.configService.get<string>('JWT_SECRET_REFRESH_TOKEN');
    this.secretAccessToken = this.configService.get<string>('JWT_SECRET_ACCESS_TOKEN');
  }

  /**
   * [description]
   * @param id
   * @param userRefreshToken
   */
  public generateAccessToken(
    { id }: UserEntity,
    { id: refreshTokenId }: UserRefreshTokenEntity,
  ): string {
    const payload: JwtAccessTokenPayloadDto = { id, refreshTokenId };
    return this.jwtService.sign(payload, {
      expiresIn: this.expiresInAccessToken,
      secret: this.secretAccessToken,
    });
  }

  /**
   * [description]
   * @param id
   * @param userRefreshToken
   */
  public generateRefreshToken(
    { id }: UserEntity,
    { id: refreshTokenId, ppid }: UserRefreshTokenEntity,
  ): string {
    const payload: JwtRefreshTokenPayloadDto = { id, refreshTokenId, ppid };
    return this.jwtService.sign(payload, {
      expiresIn: this.expiresInRefreshToken,
      secret: this.secretRefreshToken,
    });
  }

  /**
   * [description]
   * @param user
   * @param userRefreshToken
   */
  public generateTokens(user: UserEntity, userRefreshToken: UserRefreshTokenEntity): JwtTokensDto {
    const token = this.generateAccessToken(user, userRefreshToken);
    const refreshToken = this.generateRefreshToken(user, userRefreshToken);
    return { token, refreshToken };
  }

  /**
   * [description]
   * @param digits
   * @param size
   */
  public generateCode(digits = 6, size = 20): string {
    const buffer = randomBytes(size);
    const value = buffer.readUInt32BE(0x0f) % 10 ** digits;
    return value.toString().padStart(digits, '0');
  }

  /**
   * [description]
   * @param email
   * @param password
   */
  public async createToken({ email, password }: CredentialsDto): Promise<JwtTokensDto> {
    const user = await this.validateUser({ email }, { relations: null });
    if (!(await this.validatePassword(password, user.password)))
      throw new BadRequestException(ErrorTypeEnum.AUTH_INCORRECT_CREDENTIALS);
    const refreshToken = await this.userRefreshTokensService.generateAndCreateOne({ user });
    return this.generateTokens(user, refreshToken);
  }

  /**
   * [description]
   * @param data
   */
  public async createUser(data: CreateProfileDto): Promise<JwtTokensDto> {
    const user = await this.usersService.createOne(data);
    const refreshToken = await this.userRefreshTokensService.generateAndCreateOne({ user });
    return this.generateTokens(user, refreshToken);
  }

  /**
   * [description]
   * @param data
   */
  public async validateUser(
    conditions: FindOptionsWhere<UserEntity>,
    options?: FindOneOptions<UserEntity>,
  ): Promise<UserEntity> {
    return this.usersService
      .selectOneByRepository(conditions, {
        select: { id: true, password: true, baseCurrency: true },
        relations: { refreshTokens: true },
        loadEagerRelations: false,
        ...options,
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
    return compare(data, encrypted).catch(() => {
      throw new BadRequestException(ErrorTypeEnum.AUTH_PASSWORDS_DO_NOT_MATCH);
    });
  }

  /**
   * [description]
   * @param data
   */
  public async validateEmailCode(data: ConfirmationEmailDto): Promise<Partial<UserEntity>> {
    const { code, email } = data;
    const user = await this.usersService.selectOne(
      { email },
      { loadEagerRelations: false, select: { id: true, password: true } },
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
      select: { id: true },
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
    const { id, password } = await this.validateEmailCode(data);

    if (await this.validatePassword(data.password, password))
      throw new BadRequestException(ErrorTypeEnum.NEW_PASSWORD_AND_OLD_PASSWORD_CANNOT_BE_SAME);

    await this.cacheManager.del(id);
    await this.usersService.updateOne({ id }, { password: data.password });
  }

  /**
   * [description]
   * @param data
   * @param user
   */
  public async updatePassword(
    data: UpdatePasswordDto,
    user: Partial<UserEntity>,
  ): Promise<UserEntity> {
    if (!(await this.validatePassword(data.oldPassword, user.password)))
      throw new BadRequestException(ErrorTypeEnum.AUTH_PASSWORDS_DO_NOT_MATCH);
    return this.usersService.updateOne({ id: user.id }, { password: data.password });
  }

  /**
   * [description]
   * @param data
   * @param user
   */
  public async updateEmail(data: UpdateEmailDto, user: Partial<UserEntity>): Promise<UserEntity> {
    if (!(await this.validatePassword(data.password, user.password)))
      throw new BadRequestException(ErrorTypeEnum.AUTH_PASSWORDS_DO_NOT_MATCH);
    return this.usersService.updateOne({ id: user.id }, { email: data.email });
  }
}
