import { Controller, Get } from '@nestjs/common';
import { TtsServiceService } from './tts-service.service';

@Controller()
export class TtsServiceController {
  constructor(private readonly ttsServiceService: TtsServiceService) {}

  @Get()
  getHello(): string {
    return this.ttsServiceService.getHello();
  }
}
