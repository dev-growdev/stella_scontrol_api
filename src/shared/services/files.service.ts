import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/shared/modules/prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  async listFilesByKey(keys: string[]) {
    const files = await this.prisma.scFiles.findMany({
      where: {
        key: {
          in: keys,
        },
      },
    });

    const notFoundFiles = keys.filter(
      (key) => !files.some((file) => file.key === key),
    );
    if (!notFoundFiles) {
      throw new NotFoundException(
        `Arquivos não encontrados: ${notFoundFiles.join(', ')}`,
      );
    }

    return files;
  }

  async createFileOnDB(file: Express.Multer.File) {
    const randomKey = `${randomUUID()}-${file.originalname}`;
    return await this.prisma.scFiles.create({
      data: {
        key: randomKey,
        name: file.originalname,
      },
      select: {
        uid: true,
        name: true,
        key: true,
      },
    });
  }
}
