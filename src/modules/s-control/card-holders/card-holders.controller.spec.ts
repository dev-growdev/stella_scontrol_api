import { Test, TestingModule } from '@nestjs/testing';
import { CardHoldersController } from './card-holders.controller';
import { CardHoldersService } from './card-holders.service';

describe('CardHoldersController', () => {
  let controller: CardHoldersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardHoldersController],
      providers: [CardHoldersService],
    }).compile();

    controller = module.get<CardHoldersController>(CardHoldersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
