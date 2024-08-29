// text-speech/src/user.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class UserClientService {
  private client: ClientProxy;

  constructor(private readonly configService: ConfigService) {
    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: configService.get<string>('user.service.host'),
        port: configService.get<number>('user.service.port'),
      },
    });
  }

  pong() {
    return this.client.send({ cmd: 'pong' }, {});
  }

  getUser(userId: string) {
    return this.client.send({ cmd: 'get_user' }, { userId });
  }
}
