import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';
import { CardHolderParams } from './dtos/card-holders-input.dto';
import { CardHolderDto } from './dtos/card-holders-output.dto';
import Prisma from '@prisma/client';

@Injectable()
export class CardHoldersService {
  constructor(private prisma: PrismaService) {}

  async findCardHolders(
    type: CardHolderParams['type'],
  ): Promise<CardHolderDto[]> {
    try {
      const cardHolders = await this.prisma.scCardHolders.findMany({
        where: {
          type,
        },
      });

      return cardHolders.map(this.mapToDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private mapToDto(cardHolders: Prisma.ScCardHolders): CardHolderDto {
    return {
      uid: cardHolders.uid,
      code: cardHolders.code,
      name: cardHolders.name,
    };
  }
}
