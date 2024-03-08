import { Controller, Get, Param, Put } from '@nestjs/common';
import { PaymentsFormService } from './payments-form.service';

@Controller('payments-form')
export class PaymentsFormController {
  constructor(private readonly paymentsFormService: PaymentsFormService) {}

  @Get()
  findAllPaymentsForm() {
    return this.paymentsFormService.findAllPaymentsForm();
  }

  @Put(':uid')
  disablePaymentsForm(@Param('uid') uid: string) {
    return this.paymentsFormService.disablePaymentsForm(uid);
  }
}
