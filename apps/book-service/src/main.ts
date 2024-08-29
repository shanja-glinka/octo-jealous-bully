import { NestFactory } from '@nestjs/core';
import { BookServiceModule } from './book-service.module';

async function bootstrap() {
  const app = await NestFactory.create(BookServiceModule);
  await app.listen(3000);
}
bootstrap();
