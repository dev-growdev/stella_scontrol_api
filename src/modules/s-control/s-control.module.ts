import { Module } from '@nestjs/common';
import { BudgetAccountModule } from './budget-account/budget-account.module';
import { CardHoldersModule } from './card-holders/card-holders.module';
import { CategoriesModule } from './categories/categories.module';
import { PaymentRequestsGeneralModule } from './payment-requests-general/payment-requests-general.module';
import { PaymentsFormModule } from './payments-form/payments-form.module';
import { ProductsModule } from './products/products.module';
import { SupplierModule } from './supplier/supplier.module';

@Module({
  imports: [
    CategoriesModule,
    ProductsModule,
    PaymentRequestsGeneralModule,
    SupplierModule,
    BudgetAccountModule,
    PaymentsFormModule,
    CardHoldersModule,
  ],
})
export class SControlModule {}
