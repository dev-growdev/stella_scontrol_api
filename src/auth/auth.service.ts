import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService, CheckIfUserExistsService } from 'src/shared/services';

import { JwtService } from '@nestjs/jwt';

/**
 * ? @Injectable()
 * + Decorator que marca uma classe como um provider/serviço.
 * + Podem ser injetadas em outras classes via parâmetro de constructor.
 */

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private service: CheckIfUserExistsService,
    private bcrypt: BcryptService,
    private jwt: JwtService,
  ) {}
}
