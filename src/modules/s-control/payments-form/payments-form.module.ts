import { Module } from '@nestjs/common';
import { PaymentsFormService } from './payments-form.service';
import { PaymentsFormController } from './payments-form.controller';

@Module({
  controllers: [PaymentsFormController],
  providers: [PaymentsFormService]
})
export class PaymentsFormModule {}
