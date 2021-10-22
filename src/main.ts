import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ConfigModel } from './utils/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: ConfigService<ConfigModel> = app.get(ConfigService);
  const appPort = configService.get('appPort');
  console.log(`App running on port ${appPort}`);

  await app.listen(appPort);
}
bootstrap();
