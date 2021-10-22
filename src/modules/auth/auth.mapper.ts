import { IAuthDto } from './auth.dtos';

export class AuthMapper {
  static toAuthDto(): IAuthDto {
    return { accessToken: '', refreshToken: '' };
  }
}
