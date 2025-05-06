import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import * as cookieParser from 'cookie-parser';

const whitelist = process.env.CORS_WHITELIST?.split(',') || [];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: (origin, callback) => {
      callback(null, whitelist.indexOf(origin) !== -1);
    },
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
