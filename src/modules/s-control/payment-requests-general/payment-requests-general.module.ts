import { Module } from '@nestjs/common';
import { FilesService } from 'src/shared/services/files.service';
import { PrismaService } from '../../../shared/modules/prisma/prisma.service';
import { PaymentRequestsGeneralController } from './payment-requests-general.controller';
import { PaymentRequestsGeneralService } from './payment-requests-general.service';

@Module({
  controllers: [PaymentRequestsGeneralController],
  providers: [PaymentRequestsGeneralService, PrismaService, FilesService],
})
export class PaymentRequestsGeneralModule {}
