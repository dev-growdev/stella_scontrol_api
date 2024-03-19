import { Controller, Get, Param } from '@nestjs/common';
import { CardHoldersService } from './card-holders.service';

@Controller('card-holders')
export class CardHoldersController {
  constructor(private readonly cardHoldersService: CardHoldersService) {}

  @Get(':type')
  findAll(@Param('type') type: 'credit' | 'corporate') {
    return this.cardHoldersService.findCardHolders(type);
  }
}
