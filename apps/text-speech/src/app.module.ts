import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './services/app.service';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from './config/app.config';
import { LoggerService } from './services/logger.service';
import { UserServiceModule } from 'apps/user-service/src/user-service.module';
import { UserClientService } from './services/user.service';

@Module({
  imports: [
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService) => ({
    //     type: configService.get<'sqlite' | 'postgres'>('db.type'),
    //     host: configService.get<string>('db.host'),
    //     port: configService.get<number>('db.port'),
    //     username: configService.get<string>('db.user'),
    //     password: configService.get<string>('db.password'),
    //     database: configService.get<string>('db.name'),
    //     entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    //     synchronize: configService.get<boolean>('db.synchronize'),
    //   }),
    //   inject: [ConfigService],
    // }),
    AppConfigModule,
    UserServiceModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService, UserClientService],
  exports: [LoggerService],
})
export class AppModule {}
