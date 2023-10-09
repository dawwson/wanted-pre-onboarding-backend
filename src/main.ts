import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  const serverPort = configService.get<string>('server.port');
  console.log(serverPort);
  await app.listen(serverPort);
}
bootstrap();
