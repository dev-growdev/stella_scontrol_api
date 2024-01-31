// import { User } from '@models/user.model';
// import { Injectable } from '@nestjs/common';
// import { pgHelper } from '@shared/database/connections/pg-helper';
// import { UserEntity } from '@shared/database/entities';
// import { PrismaService } from 'src/prisma/prisma.service';

// interface LoadUserByLoginOrUidDTO {
//   login?: string;
//   uid?: string;
// }

// @Injectable()
// export class LoadUserByLoginOrUidService {
//     constructor(private prisma: PrismaService) {}

//   async loadUser(dto: LoadUserByLoginOrUidDTO): Promise<User | undefined> {
//     const manager = pgHelper.client.manager;

//     const userEntity = await manager.findOne(UserEntity, {
//       where: [
//         {
//           login: dto.login,
//         },
//         {
//           uid: dto.uid,
//         },
//       ],
//       relations: ['profileEntity', 'userRoleEntity', 'userRoleEntity.role'],
//     });

//     if (!userEntity) return undefined;

//     const user = new User({
//       userUid: userEntity.uid,
//       profileUid: userEntity.profile.uid,
//       role: userEntity.userRoleEntity?.role?.type as number,
//       userRoleUid: userEntity.userRole.uid,
//       name: userEntity.profile.name,
//       enable: userEntity.enable,
//       email: userEntity.profile.email,
//       document: userEntity.profile.document,
//       phone: userEntity.profile.phone,
//     });

//     user.addCredential(
//       new CredentialUser({
//         login: userEntity.login,
//         password: userEntity.password,
//         enable: userEntity.enable,
//         verified: userEntity.verified,
//       }),
//     );

//     return user;
//   }
// }
