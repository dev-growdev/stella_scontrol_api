import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CardHoldersService {
  constructor(private prisma: PrismaService) {}

  async findCardHolders(type: string) {
    try {
      if (type === 'credit') {
        const cardHoldersCredit = await this.prisma.cardHolders.findMany({
          where: {
            type: 'credit',
          },
          select: {
            uid: true,
            name: true,
          },
        });

        return cardHoldersCredit;
      }

      if (type === 'corporate') {
        const cardHoldersCorporate = await this.prisma.cardHolders.findMany({
          where: {
            type: 'corporate',
          },
          select: {
            uid: true,
            name: true,
          },
        });

        return cardHoldersCorporate;
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
