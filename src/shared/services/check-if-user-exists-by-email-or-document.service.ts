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
}
