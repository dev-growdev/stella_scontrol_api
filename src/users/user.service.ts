import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface UserWithRelations {}
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  // create(createUserDto: CreateUserDto) {
  //   return 'This action adds a new user';
  // }

  // async findAll(): Promise<UserDTO[]> {
  //   const users = await this.prisma.user.findMany({
  //     include: {
  //       profile: true,
  //       userRole: {
  //         include: {
  //           role: true,
  //         },
  //       },
  //     },
  //   });

  //   return users.map((u) => this.mapToDTO(u));
  // }

  // async findOne(uid: string): Promise<UserDTO> {
  //   const user = await this.prisma.user.findUnique({
  //     where: { uid },
  //     include: {
  //       profile: true,
  //       userRole: {
  //         include: {
  //           role: true,
  //         },
  //       },
  //     },
  //   });

  //   return this.mapToDTO(user);
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }

  // private mapToDTO(entity: UserWithRelations): UserDTO {
  //   return {
  //     uid: entity.uid,
  //     enable: entity.enable,
  //     name: entity.profile.name,
  //     phone: entity.profile.phone,
  //     document: entity.profile.document,
  //     role: entity.userRole.role.type as ERoleType,
  //   };
  // }
}
