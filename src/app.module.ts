import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './shared/modules/prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './shared/modules/email/email.module';
import { SControlModule } from './modules/s-control/s-control.module';
import { SAuthModule } from './modules/s-auth/s-auth.module';
import { SIntegrationModule } from './modules/s-integration/s-integration.module';
import { commonProviders } from './app.providers';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EmailModule,
    PrismaModule,
    MulterModule.register({
      dest: './files',
    }),
    SControlModule,
    SAuthModule,
    SIntegrationModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...commonProviders],
})
export class AppModule {}
