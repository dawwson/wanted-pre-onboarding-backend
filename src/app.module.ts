import * as path from 'path';

import { APP_GUARD } from '@nestjs/core';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolesGuard } from './common/guard/roles.guard';
import { AuthMiddleware } from './common/middleware/auth.middleware';

import dbConfig from './config/db.config';
import serverConfig from './config/server.config';

import { JobPostingModule } from './job-posting/job-posting.module';
import { UserModule } from './user/user.module';

import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [dbConfig, serverConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('db');
        const serverConfig = configService.get('server');

        return {
          type: dbConfig.type,
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
          entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
          synchronize: serverConfig.nodeEnv === 'development', // NOTE: 추후 마이그레이션으로 테이블 생성
          logging: serverConfig.nodeEnv === 'development',
        };
      },
    }),
    JobPostingModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
