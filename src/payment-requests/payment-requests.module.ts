import { Module } from '@nestjs/common';
import { PaymentRequestsService } from './payment-requests.service';
import { PaymentRequestsController } from './payment-requests.controller';

@Module({
  controllers: [PaymentRequestsController],
  providers: [PaymentRequestsService]
})
export class PaymentRequestsModule {}
