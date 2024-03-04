import { Controller, Get, Query } from '@nestjs/common';
import { CardHoldersService } from './card-holders.service';

@Controller('card-holders')
export class CardHoldersController {
  constructor(private readonly cardHoldersService: CardHoldersService) {}

  @Get()
  findAll(@Query('type') type?: string) {
    return this.cardHoldersService.findCardHolders(type);
  }
}
