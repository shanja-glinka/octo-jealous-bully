import { Test, TestingModule } from '@nestjs/testing';
import { TtsServiceController } from './tts-service.controller';
import { TtsServiceService } from './tts-service.service';

describe('TtsServiceController', () => {
  let ttsServiceController: TtsServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TtsServiceController],
      providers: [TtsServiceService],
    }).compile();

    ttsServiceController = app.get<TtsServiceController>(TtsServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(ttsServiceController.getHello()).toBe('Hello World!');
    });
  });
});
