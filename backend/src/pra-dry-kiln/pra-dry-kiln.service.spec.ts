import { Test, TestingModule } from '@nestjs/testing';
import { PraDryKilnService } from './pra-dry-kiln.service';

describe('PraDryKilnService', () => {
  let service: PraDryKilnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PraDryKilnService],
    }).compile();

    service = module.get<PraDryKilnService>(PraDryKilnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
