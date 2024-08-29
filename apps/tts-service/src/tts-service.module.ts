import { Module } from '@nestjs/common';
import { TtsServiceController } from './tts-service.controller';
import { TtsServiceService } from './tts-service.service';

@Module({
  imports: [],
  controllers: [TtsServiceController],
  providers: [TtsServiceService],
})
export class TtsServiceModule {}
