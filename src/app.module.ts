import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';

import { AppController } from './app.controller';
import databaseConfig from './config/database.config';
import serverConfig from './config/server.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig, serverConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('db');
        return {
          type: dbConfig.dialect,
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.name,
          entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
          synchronize: true, // NOTE: 개발 환경에서만 사용
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
