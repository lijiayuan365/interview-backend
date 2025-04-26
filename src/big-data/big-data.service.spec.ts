import { Test, TestingModule } from '@nestjs/testing';
import { BigDataService } from './big-data.service';

describe('BigDataService', () => {
  let service: BigDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BigDataService],
    }).compile();

    service = module.get<BigDataService>(BigDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
