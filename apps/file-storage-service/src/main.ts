import { NestFactory } from '@nestjs/core';
import { FileStorageServiceModule } from './file-storage-service.module';

async function bootstrap() {
  const app = await NestFactory.create(FileStorageServiceModule);
  await app.listen(3000);
}
bootstrap();
