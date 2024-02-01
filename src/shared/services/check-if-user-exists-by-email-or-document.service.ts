import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

/**
 *
 *
 * @export
 * @class CheckIfUserExistsService
 * - Check if an user exists in DB via your e-mail
 * @param `email` - string
 *
 */
@Injectable()
export class CheckIfUserExistsService {
  constructor(private prisma: PrismaService) {}

  // async checkIfUserExistsByEmailOrDocument(
  //   email?: string,
  //   document?: string,
  // ): Promise<boolean> {
  //   if (document) {
  //     const documentAlreadyExists = await this.prisma.dataProfile.findUnique({
  //       where: { document },
  //     });

  //     return !!documentAlreadyExists;
  //   }

  //   if (email) {
  //     const emailAlreadyExists = await this.prisma.user.findUnique({
  //       where: { email },
  //     });

  //     return !!emailAlreadyExists;
  //   }
  // }
}
