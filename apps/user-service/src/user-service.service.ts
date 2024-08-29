import { Injectable } from '@nestjs/common';

@Injectable()
export class UserServiceService {
  pong(): string {
    return 'UserServiceService says: PONG!';
  }

  getUser(userId: string): string {
    return userId;
  }
}
