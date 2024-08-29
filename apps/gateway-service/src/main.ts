import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { LoggerService } from 'apps/text-speech/src/services/logger.service';
import { GatewayServiceModule } from './gateway-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    GatewayServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.GATEWAY_SERVICE_HOST || '0.0.0.0',
        port: parseInt(process.env.GATEWAY_SERVICE_PORT, 10) || 3009,
      },
    },
  );

  const loggerService = app.get(LoggerService);
  const port = parseInt(process.env.GATEWAY_SERVICE_PORT, 10) || 3009;

  await app.listen();

  loggerService.info(
    `${process.env.GATEWAY_SERVICE_NAME} is live on and serving traffic on port ${port}`,
  );
}
bootstrap();
