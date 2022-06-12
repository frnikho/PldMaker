import { Test, TestingModule } from '@nestjs/testing';
import { DodService } from './dod.service';

describe('DodService', () => {
  let service: DodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DodService],
    }).compile();

    service = module.get<DodService>(DodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
