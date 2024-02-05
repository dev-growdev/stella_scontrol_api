import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthDTO } from './dtos';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async signin(dto: AuthDTO) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (existingUser) {
        throw new ConflictException('Usuário com este email já existe.');
      }

      const createdUser = await this.prisma.$transaction(
        async (transaction) => {
          const user = await transaction.user.create({
            data: {
              email: dto.email,
              password: dto.password,
              token: dto.token,
            },
          });

          const access_token = await this.jwt.signAsync({uid: user.uid});

          return {
            user,
            access_token,
          };
        },
      );

      return createdUser;
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
