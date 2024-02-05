import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentRequestsGeneralService } from './payment-requests-general.service';
import { PaymentRequestsGeneralController } from './payment-requests-general.controller';

@Module({
  controllers: [PaymentRequestsGeneralController],
  providers: [PaymentRequestsGeneralService, PrismaService]
})
export class PaymentRequestsGeneralModule {}
