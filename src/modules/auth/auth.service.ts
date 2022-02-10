import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { ErrorTypeEnum } from 'src/common/enums';
import { ConfigService } from 'src/config';

import { UserEntity } from '../users/entities';
import { UsersService } from '../users';

import { CredentialsDto, JwtResponseDto, CreateProfileDto } from './dto';

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
    private readonly configService: ConfigService,
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
   * @param email
   * @param password
   */
  public async createToken({ email, password }: CredentialsDto): Promise<JwtResponseDto> {
    const user = await this.validateUser({ email });
    if (bcrypt.compareSync(password, user.password)) return this.generateToken(user);
    throw new UnauthorizedException(ErrorTypeEnum.AUTH_INCORRECT_CREDENTIALS);
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
  public async validateUser(data: Partial<UserEntity>): Promise<UserEntity> {
    return this.usersService
      .selectOne(data, { loadEagerRelations: false, select: ['id', 'password'] })
      .catch(() => {
        throw new UnauthorizedException(ErrorTypeEnum.AUTH_INCORRECT_CREDENTIALS);
      });
  }
}
