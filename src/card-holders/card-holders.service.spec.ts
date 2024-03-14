import { Test, TestingModule } from '@nestjs/testing';
import { CardHoldersService } from './card-holders.service';

describe('CardHoldersService', () => {
  let service: CardHoldersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardHoldersService],
    }).compile();

    service = module.get<CardHoldersService>(CardHoldersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
