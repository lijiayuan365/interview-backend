import { Test, TestingModule } from '@nestjs/testing';
import { BigDataController } from './big-data.controller';

describe('BigDataController', () => {
  let controller: BigDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BigDataController],
    }).compile();

    controller = module.get<BigDataController>(BigDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
