import { Module } from '@nestjs/common';
import { BudgetAccountService } from './budget-account.service';
import { BudgetAccountController } from './budget-account.controller';
import { IntegrationsModule } from 'src/integrations/integration.module';

@Module({
  imports: [IntegrationsModule],
  controllers: [BudgetAccountController],
  providers: [BudgetAccountService],
})
export class BudgetAccountModule {}
