import { Module } from '@nestjs/common';
import { BudgetAccountService } from './budget-account.service';
import { BudgetAccountController } from './budget-account.controller';
import { FacadesModule } from '@/modules/@facades/facades.module';

@Module({
  imports: [FacadesModule],
  controllers: [BudgetAccountController],
  providers: [BudgetAccountService],
})
export class BudgetAccountModule {}
