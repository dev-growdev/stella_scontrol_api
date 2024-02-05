import { Controller, Post, Body } from '@nestjs/common';
import { PaymentRequestGeneralDTO } from './dto';
import { PaymentRequestsGeneralService } from './payment-requests-general.service';

@Controller()
export class PaymentRequestsGeneralController {
  constructor(
    private readonly paymentRequestsGeneralService: PaymentRequestsGeneralService,
  ) {}

  @Post('payment-request-general')
  create(@Body() paymentRequestGeneral: PaymentRequestGeneralDTO) {
    return this.paymentRequestsGeneralService.create(paymentRequestGeneral);
  }
}
