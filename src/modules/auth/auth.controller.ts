import { Controller, Post, Body } from '@nestjs/common';

import { CurrentAccount, Public } from '../../utils/decorators';
import { AccountMapper } from '../account';

import { ICurrentAccDto, ILoginDto, IRegisterDto } from './auth.dtos';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  checkAuthenticate() {
    return 'authenticated';
  }

  @Public()
  @Post('login')
  async login(@Body() { username, password }: ILoginDto) {
    return this.authService.login({ username, password });
  }

  @Post('logout')
  async logout(@CurrentAccount() account: ICurrentAccDto) {
    this.authService.logout(account.refreshTokenId);

    return;
  }

  @Public()
  @Post('register')
  async register(@Body() regisDto: IRegisterDto) {
    const acc = await this.authService.register(regisDto);

    return AccountMapper.toResponseDto(acc);
  }

  @Post('refresh-token')
  async refreshToken(
    @CurrentAccount() account: ICurrentAccDto,
    @Body('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshToken(account.refreshTokenId, refreshToken);
  }
}
