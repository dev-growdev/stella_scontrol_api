import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CardHoldersService } from './card-holders.service';
import { PrismaService } from '@shared/modules/prisma/prisma.service';

describe('CardHoldersService', () => {
  let service: CardHoldersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardHoldersService, ConfigService, PrismaService],
    }).compile();

    service = module.get<CardHoldersService>(CardHoldersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
