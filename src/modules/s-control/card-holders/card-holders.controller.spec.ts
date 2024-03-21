import { Test, TestingModule } from '@nestjs/testing';
import { CardHoldersController } from './card-holders.controller';
import { CardHoldersService } from './card-holders.service';
import { PrismaService } from '@/shared/modules/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('CardHoldersController', () => {
  let controller: CardHoldersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardHoldersController],
      providers: [CardHoldersService, PrismaService, ConfigService],
    }).compile();

    controller = module.get<CardHoldersController>(CardHoldersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
