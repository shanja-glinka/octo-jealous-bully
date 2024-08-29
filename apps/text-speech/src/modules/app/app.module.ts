import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserServiceModule } from 'apps/user-service/src/user-service.module';
import { AppConfigModule } from '../../config/app-module.config';
import { AppService } from '../../services/app.service';
import { LoggerService } from '../../services/logger.service';
import { UserClientService } from '../../services/user.service';
import { SharedModule } from '../core/shared.module';
import { AppController } from './app.controller';
import { TextModule } from '../text/text.module';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<'sqlite' | 'postgres'>('db.type'),
        host: configService.get<string>('db.host'),
        port: configService.get<number>('db.port'),
        username: configService.get<string>('db.user'),
        password: configService.get<string>('db.password'),
        database: configService.get<string>('db.name'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('db.synchronize'),
      }),
      inject: [ConfigService],
    }),
    AppConfigModule,
    UserServiceModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    TextModule,
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService, UserClientService],
  exports: [LoggerService],
})
export class AppModule {}
