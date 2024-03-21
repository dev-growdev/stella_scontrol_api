import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@shared/modules/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async disableUser(idUserAd: string) {
    try {
      if (!idUserAd) {
        throw new BadRequestException('ID do usuário não fornecido');
      }

      const updatedUser = await this.prisma.user.update({
        where: {
          idUserAd: idUserAd,
        },
        data: {
          enable: false,
        },
      });

      if (!updatedUser) {
        throw new NotFoundException('Usuário não encontrado!');
      }

      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
