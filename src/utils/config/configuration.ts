import { ConfigModel } from './model';

export const configuration = (): ConfigModel => ({
  appPort: Number(process.env.APP_PORT) || 3000,
  dbHost: process.env.DATABASE_HOST,
  dbPort: Number(process.env.DATABASE_PORT) || 5432,
  dbName: process.env.DATABASE_NAME,
  dbUsername: process.env.DATABASE_USERNAME,
  dbPassword: process.env.DATABASE_PASSWORD,
  passwordSaltRound: Number(process.env.PASSWORD_SALT_ROUND),
  jwtSecreteKey: process.env.JWT_SECRETE_KEY,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  refreshTokenSaltRound: Number(process.env.REFRESH_TOKEN_SALT_ROUND),
});
