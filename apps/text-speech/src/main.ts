import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './config/all-exceptions.filter';
import { ValidationPipeConfig } from './config/validation-pipe.config';
import { LoggerService } from './services/logger.service';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api/v1');
  app.enableVersioning({ type: VersioningType.URI });

  const httpAdapterHost = app.get(HttpAdapterHost);
  const loggerService = app.get(LoggerService);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost, loggerService));
  app.useGlobalPipes(ValidationPipeConfig());

  app.use(helmet());
  app.enableCors();
  // setupSwagger(app);
  app.use(cookieParser());

  const port = configService.get<number>('app.port');
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 3001,
    },
  });

  await app.startAllMicroservices();
  await app.listen(port, () => {
    loggerService.info(
      `${process.env.APP_NAME} is live on and serving traffic on port ${port}`,
    );
  });
}
bootstrap();
