import { Module } from '@nestjs/common';
import { PaymentRequestsService } from './payment-requests-general.service';
import { PaymentRequestsController } from './payment-requests-general.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PaymentRequestsController],
  providers: [PaymentRequestsService, PrismaService]
})
export class PaymentRequestsModule {}
