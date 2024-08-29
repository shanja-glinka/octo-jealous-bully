import { Injectable } from '@nestjs/common';

@Injectable()
export class TtsServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
