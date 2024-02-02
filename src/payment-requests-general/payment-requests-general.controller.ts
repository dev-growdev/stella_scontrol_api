import { Controller, Post, Body } from '@nestjs/common';
import { PaymentRequestGeneralDTO } from './dto';
import { PaymentRequestsService } from './payment-requests-general.service';

@Controller()
export class PaymentRequestsController {
  constructor(
    private readonly paymentRequestsService: PaymentRequestsService,
  ) {}

  @Post('payment-request-general')
  create(@Body() paymentRequestGeneral: PaymentRequestGeneralDTO) {
    return this.paymentRequestsService.create(paymentRequestGeneral);
  }
}
