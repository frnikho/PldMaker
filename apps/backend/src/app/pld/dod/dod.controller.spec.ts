import { Test, TestingModule } from '@nestjs/testing';
import { DodController } from './dod.controller';

describe('DodController', () => {
  let controller: DodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DodController],
    }).compile();

    controller = module.get<DodController>(DodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
