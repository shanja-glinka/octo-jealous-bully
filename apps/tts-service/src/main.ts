import { NestFactory } from '@nestjs/core';
import { TtsServiceModule } from './tts-service.module';

async function bootstrap() {
  const app = await NestFactory.create(TtsServiceModule);
  await app.listen(3000);
}
bootstrap();
