import { Controller, Get } from '@nestjs/common';
import { UserServiceService } from './user-service.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class UserServiceController {
  constructor(private readonly userServiceService: UserServiceService) {}

  @MessagePattern({ cmd: 'pong' })
  async pong() {
    return this.userServiceService.pong();
  }

  @MessagePattern({ cmd: 'get_user' })
  async getUser(data: { userId: string }) {
    return this.userServiceService.getUser(data.userId);
  }
}
