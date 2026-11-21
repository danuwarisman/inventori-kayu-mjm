import { Test, TestingModule } from '@nestjs/testing';
import { PraDryKilnController } from './pra-dry-kiln.controller';

describe('PraDryKilnController', () => {
  let controller: PraDryKilnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PraDryKilnController],
    }).compile();

    controller = module.get<PraDryKilnController>(PraDryKilnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
