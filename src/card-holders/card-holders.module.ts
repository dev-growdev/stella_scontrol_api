import { Module } from '@nestjs/common';
import { CardHoldersService } from './card-holders.service';
import { CardHoldersController } from './card-holders.controller';

@Module({
  controllers: [CardHoldersController],
  providers: [CardHoldersService]
})
export class CardHoldersModule {}
