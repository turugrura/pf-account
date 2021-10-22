import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { FindOneOptions, Repository } from 'typeorm';

import { AppError } from '../../utils/app-error';
import { ConfigModel } from '../../utils/config';
import { AccountEntity, AccountService } from '../account';

import { IJWTPayloadDto, ILoginDto, IAuthDto, IRegisterDto } from './auth.dtos';
import { RefreshTokenEntity } from './refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
    @InjectRepository(RefreshTokenEntity)
    private refreshTokenRepo: Repository<RefreshTokenEntity>,
    private configService: ConfigService<ConfigModel>,
  ) {}

  async findAccount(
    username: string,
    password: string,
  ): Promise<AccountEntity> {
    const account = await this.accountService.findByUsername(username);
    if (account && bcrypt.compareSync(password, account.password)) {
      return account;
    }

    return null;
  }

  async register(registerDto: IRegisterDto) {
    const { username, password } = registerDto;

    return this.accountService.create({ username, password });
  }

  async login(loginDto: ILoginDto): Promise<IAuthDto> {
    const { username, password } = loginDto;
    const acc = await this.findAccount(username, password);
    if (!acc) {
      throw AppError.badRequest();
    }

    const refreshToken = await this.saveRefreshToken(acc);

    return this.genJwtPayload(refreshToken, acc);
  }

  async logout(refreshTokenId: number) {
    const refreshToken = await this.refreshTokenRepo.findOne(refreshTokenId);
    if (!refreshToken) {
      return;
    }

    refreshToken.isActive = false;
    await this.refreshTokenRepo.save(refreshToken);
  }

  async saveRefreshToken(account: AccountEntity) {
    const refreshToken = new RefreshTokenEntity();
    refreshToken.account = account;
    refreshToken.expiryDate = new Date();
    refreshToken.refreshToken = await this.genRefreshToken();

    return await this.refreshTokenRepo.save(refreshToken);
  }

  async genRefreshToken() {
    return await bcrypt.hash(
      this.configService.get('refreshTokenSecret'),
      this.configService.get('refreshTokenSaltRound'),
    );
  }

  genJwtPayload(refreshToken: RefreshTokenEntity, account: AccountEntity) {
    const payload: IJWTPayloadDto = {
      username: account.username,
      sub: account.id,
      refreshTokenId: refreshToken.id,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: refreshToken.refreshToken,
    };
  }

  async findRefreshTokenById(
    id: number,
    options?: FindOneOptions<RefreshTokenEntity>,
  ) {
    return this.refreshTokenRepo.findOne(id, options);
  }

  async refreshToken(
    refreshTokenId: number,
    refreshToken: string,
  ): Promise<IAuthDto> {
    const reTkEntity = await this.refreshTokenRepo.findOne(refreshTokenId, {
      relations: ['account'],
    });
    if (!reTkEntity || !reTkEntity.isActive) {
      throw AppError.unauthorized();
    }

    if (reTkEntity.refreshToken !== refreshToken) {
      throw AppError.unauthorized();
    }

    reTkEntity.refreshToken = await this.genRefreshToken();
    await this.refreshTokenRepo.save(reTkEntity);

    return this.genJwtPayload(reTkEntity, reTkEntity.account);
  }
}
