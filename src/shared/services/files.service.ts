import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  async listFilesByKey(keys: string[]) {
    const files = await this.prisma.files.findMany({
      where: {
        key: {
          in: keys,
        },
      },
    });

    if (files.length !== keys.length) {
      const notFoundFiles = keys.filter(
        (imgKey) => !files.find((file) => file.key === imgKey),
      );
      throw new NotFoundException(
        `Arquivos não encontrados: ${notFoundFiles.join(', ')}`,
      );
    }

    return files;
  }

  async createFileOnDB(file: Express.Multer.File) {
    return await this.prisma.files.create({
      data: {
        key: file.filename,
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
