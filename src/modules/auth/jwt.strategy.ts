import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppError } from '../../utils/app-error';
import { ConfigModel } from '../../utils/config';
import { AccountService } from '../account';

import { ICurrentAccDto, IDecodedTokenDto } from './auth.dtos';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService<ConfigModel>,
    private accountService: AccountService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwtSecreteKey'),
    });
  }

  async validate(payload: IDecodedTokenDto): Promise<ICurrentAccDto> {
    const refreshTk = await this.authService.findRefreshTokenById(
      payload.refreshTokenId,
      {
        relations: ['account'],
      },
    );
    if (!refreshTk || !refreshTk.isActive) {
      throw AppError.unauthorized();
    }

    const { id: accountId, username } = refreshTk.account;

    return { accountId, username, refreshTokenId: refreshTk.id };
  }
}
