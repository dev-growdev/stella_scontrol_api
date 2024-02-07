import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
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
        const createdUser = await this.prisma.user.create({
          data: {
            idUserAd: dto.idUserAd,
            email: dto.email,
            name: dto.name,
          },
        });

        const access_token = await this.jwt.signAsync({
          uid: createdUser.uid,
          name: createdUser.name,
          email: createdUser.email,
          idUserAd: createdUser.idUserAd,
        });

        return {
          user: createdUser,
          access_token,
        };
      }

      const access_token = await this.jwt.signAsync({
        uid: existingUser.uid,
        name: existingUser.name,
        email: existingUser.email,
        idUserAd: existingUser.idUserAd,
      });

      return {
        user: existingUser,
        access_token,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUserByUid(userId: string) {
    const foundUser = await this.prisma.user.findUnique({
      where: { uid: userId },
    });

    if (!foundUser) {
      throw new UnauthorizedException('Usuário não autorizado.');
    }

    const user: any = {
      uuid: foundUser.uid,
      idUserAd: foundUser.idUserAd,
      data: {
        displayName: foundUser.name,
        email: foundUser.email,
        photoURL: '',
        shortcuts: [],
      },
      role: ['admin'],
    };

    return { user };
  }
}
