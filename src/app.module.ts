import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, RouterModule, Routes } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './modules/account';
import { AuthModule } from './modules/auth';
import { entities } from './modules/entities';
import { ConfigModel, configuration } from './utils/config';
import { JwtAuthGuard } from './utils/guards';
import { ErrorsInterceptor, TransformInterceptor } from './utils/interceptors';

const routes: Routes = [
  { path: 'accounts', module: AccountModule },
  { path: 'auth', module: AuthModule },
];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    RouterModule.register(routes),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigModel>) => {
        return {
          type: 'mysql',
          host: configService.get('dbHost'),
          port: configService.get('dbPort'),
          username: configService.get('dbUsername'),
          password: configService.get('dbPassword'),
          database: configService.get('dbName'),
          entities: [...entities],
        };
      },
    }),
    AccountModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
