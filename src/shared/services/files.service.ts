//import { S3 } from '@aws-sdk/client-s3';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(private config: ConfigService, private prisma: PrismaService) {}

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
}
