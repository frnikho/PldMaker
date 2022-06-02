import { Test, TestingModule } from '@nestjs/testing';
import { PldController } from './pld.controller';

describe('PldController', () => {
  let controller: PldController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PldController],
    }).compile();

    controller = module.get<PldController>(PldController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
