import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CardHoldersService } from './card-holders.service';
import { CardHolderParams } from './dtos/card-holders-input.dto';

@ApiTags('Titulares de cartão')
@ApiBearerAuth()
@Controller('card-holders')
export class CardHoldersController {
  constructor(private readonly cardHoldersService: CardHoldersService) {}

  @Get(':type')
  findAll(@Param() params: CardHolderParams) {
    return this.cardHoldersService.findCardHolders(params.type);
  }
}
