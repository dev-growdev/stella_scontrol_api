import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CardHoldersService {
  constructor(private prisma: PrismaService) {}

  async findCardHolders(type: 'credit' | 'corporate') {
    try {
      const cardHolders = await this.prisma.cardHolders.findMany({
        where: {
          type,
        },
        select: {
          uid: true,
          name: true,
        },
      });

      return cardHolders;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
