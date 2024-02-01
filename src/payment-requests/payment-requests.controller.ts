import { Controller, Post, Body } from '@nestjs/common';
import { PaymentRequestsService } from './payment-requests.service';
import { PaymentRequestGeneralDTO } from './dto';

@Controller()
export class PaymentRequestsController {
  constructor(
    private readonly paymentRequestsService: PaymentRequestsService,
  ) {}

  @Post('payment-request-general')
  createPaymentRequestGeneral(@Body() paymentRequestGeneral: PaymentRequestGeneralDTO) {
    return this.paymentRequestsService.createPaymentRequestGeneral(
      paymentRequestGeneral,
    );
  }
}
