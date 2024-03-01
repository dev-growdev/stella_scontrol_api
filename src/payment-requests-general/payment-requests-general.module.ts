import { Module } from '@nestjs/common';
import { AWSService } from 'src/shared/services/aws.service';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentRequestsGeneralController } from './payment-requests-general.controller';
import { PaymentRequestsGeneralService } from './payment-requests-general.service';

@Module({
  controllers: [PaymentRequestsGeneralController],
  providers: [PaymentRequestsGeneralService, PrismaService, AWSService],
})
export class PaymentRequestsGeneralModule {}
