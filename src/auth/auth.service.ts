import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dtos';

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

      if (!existingUser) {
        const createdUser = await this.prisma.$transaction(
          async (transaction) => {
            await transaction.user.create({
              data: {
                name: dto.name,
                email: dto.email,
                password: dto.password,
                token: dto.token,
              },
            });

            const access_token = await this.jwt.signAsync({
              uid: createdUser.uid,
            });

            return {
              createdUser,
              access_token,
            };
          },
        );
      }

      const access_token = await this.jwt.signAsync({ uid: existingUser.uid });

      return {
        existingUser,
        access_token,
      };
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
