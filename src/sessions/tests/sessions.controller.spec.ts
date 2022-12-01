import { Test, TestingModule } from '@nestjs/testing';
import { SessionsController } from '../api/sessions.controller';
import { SessionsService } from '../application/sessions.service';

describe('SessionsController', () => {
  let controller: SessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [SessionsService],
    }).compile();

    controller = module.get<SessionsController>(SessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
