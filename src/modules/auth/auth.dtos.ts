export interface IRegisterDto {
  username: string;
  password: string;
}

export interface IValidateUserDto {
  username: string;
  password: string;
}

export interface ILoginDto {
  username: string;
  password: string;
}

export interface ILoginResponseDto {
  username: string;
  password: string;
}

export interface IAuthDto {
  accessToken: string;
  refreshToken: string;
}

export interface IJWTPayloadDto {
  username: string;
  sub: string;
  refreshTokenId: number;
}

export interface IDecodedTokenDto extends IJWTPayloadDto {
  iat: number;
  exp: number;
}

export interface ICurrentAccDto extends Omit<IJWTPayloadDto, 'sub'> {
  accountId: string;
}
