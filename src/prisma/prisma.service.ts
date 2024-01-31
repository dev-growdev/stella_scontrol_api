import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
      log:
        process.env.NODE_ENV === 'development' ? ['info', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
