export interface ConfigModel {
  appPort: number;

  dbHost: string;
  dbName: string;
  dbUsername: string;
  dbPassword: string;
  dbPort: number;

  passwordSaltRound: number;

  jwtSecreteKey: string;
  jwtExpiresIn: string;
  refreshTokenSecret: string;
  refreshTokenSaltRound: number;
}
