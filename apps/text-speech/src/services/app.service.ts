import { Inject, Injectable } from '@nestjs/common';
import { UserClientService } from './user.service';

@Injectable()
export class AppService {
  constructor(
    @Inject(UserClientService)
    private readonly userClientService: UserClientService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  makePingToUserService() {
    return this.userClientService.pong();
  }
}
