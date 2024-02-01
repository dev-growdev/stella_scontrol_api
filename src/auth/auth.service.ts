import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO, AuthUser } from './dtos';
import { BcryptService, CheckIfUserExistsService } from 'src/shared/services';
import { ERoleType } from 'src/shared/enums';

import { JwtService } from '@nestjs/jwt';
import { User } from 'src/shared/models';

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

  // async signup(dto: AuthDTO): Promise<Omit<User, 'password'>> {
  //   // check if user exists
  //   const userAlreadyExists =
  //     await this.service.checkIfUserExistsByEmailOrDocument(dto.email);

  //   if (userAlreadyExists)
  //     throw new ConflictException(
  //       'Já existe um usuário cadastrado com o e-mail informado',
  //     );

  //   // check if document exists
  //   if (dto.document) {
  //     const documentAlreadyExists =
  //       await this.service.checkIfUserExistsByEmailOrDocument(
  //         null,
  //         dto.document,
  //       );

  //     if (documentAlreadyExists)
  //       throw new ConflictException(
  //         'Já existe um usuário cadastrado com o documento informado',
  //       );
  //   }

  //   const hash = await this.bcrypt.hash(dto.password);

  //   // save the new user in db
  //   let user: Omit<User, 'password'>;
  //   try {
  //     await this.prisma.$transaction(async (transaction) => {
  //       const defaultRole = await transaction.role.findFirst({
  //         where: { type: ERoleType.USER },
  //       });

  //       const dataProfile = await transaction.dataProfile.create({
  //         data: {
  //           email: dto.email,
  //           phone: dto.phone,
  //           name: dto.name,
  //           document: dto.document,
  //         },
  //       });

  //       const data = {
  //         ...dto,
  //         password: hash,
  //         dataProfileUid: dataProfile.uid,
  //       };

  //       const createdUser = await transaction.user.create({
  //         data: {
  //           email: data.email,
  //           password: data.password,
  //           dataProfileUid: data.dataProfileUid,
  //         },
  //       });

  //       await transaction.userRole.create({
  //         data: {
  //           userUid: createdUser.uid,
  //           roleUid: defaultRole.uid,
  //           actions: '{}',
  //         },
  //       });

  //       user = {
  //         uid: createdUser.uid,
  //         email: createdUser.email,
  //         enable: createdUser.enable,
  //         name: dataProfile.name,
  //         role: defaultRole.type as ERoleType,
  //         phone: dataProfile.phone,
  //         document: dataProfile.document ?? undefined,
  //       };
  //     });
  //   } catch (error: any) {
  //     throw new InternalServerErrorException(error.message);
  //   } finally {
  //     await this.prisma.$disconnect();
  //   }
  //   // call service to active user account?

  //   return user;
  // }

  // async signin(dto: Pick<AuthDTO, 'email' | 'password'>): Promise<AuthUser> {
  //   const credentialUser = await this.prisma.user.findUnique({
  //     where: { email: dto.email },
  //     include: {
  //       profile: true,
  //       userRole: {
  //         include: { role: true },
  //       },
  //     },
  //   });

  //   if (!credentialUser) throw new BadRequestException('E-mail inválido');

  //   if (!credentialUser.enable)
  //     throw new ForbiddenException('Usuário não habilitado');

  //   const correctPassword = await this.bcrypt.compare(
  //     dto.password,
  //     credentialUser.password,
  //   );

  //   if (!correctPassword) throw new BadRequestException('Senha inválida');

  //   const token = await this.jwt.signAsync({ userUid: credentialUser.uid });

  //   const user: Omit<User, 'password'> = {
  //     uid: credentialUser.uid,
  //     email: credentialUser.email,
  //     enable: credentialUser.enable,
  //     name: credentialUser.profile.name,
  //     phone: credentialUser.profile.phone,
  //     role: credentialUser.userRole.role.type,
  //   };

  //   return {
  //     token,
  //     user,
  //   };
  // }
}
