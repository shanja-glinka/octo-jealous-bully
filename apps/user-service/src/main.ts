import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { LoggerService } from 'apps/text-speech/src/services/logger.service';
import { UserServiceModule } from './user-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.USER_SERVICE_HOST || '0.0.0.0',
        port: parseInt(process.env.USER_SERVICE_PORT, 10) || 3001,
      },
    },
  );

  console.log(process.env);

  const loggerService = app.get(LoggerService);
  const port = parseInt(process.env.USER_SERVICE_PORT, 10) || 3001;

  await app.listen();

  loggerService.info(
    `${process.env.USER_SERVICE_NAME} is live on and serving traffic on port ${port}`,
  );
}
bootstrap();
