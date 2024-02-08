import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async remove(idUserAd: string) {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: {
          idUserAd: idUserAd,
        },
      });

      if (!deletedUser) {
        throw new NotFoundException(`Usuário não encontrado!`);
      }

      return deletedUser;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
