import { Controller, Get, Param } from '@nestjs/common';
import { BudgetAccountService } from './budget-account.service';
import {
  AccountingAccounts,
  CostCenterCesar,
} from 'src/integrations/dto/cesar.dto.ts';

@Controller()
export class BudgetAccountController {
  constructor(private readonly budgetAccountService: BudgetAccountService) {}

  @Get('cost-centers')
  getCostCenters(): Promise<CostCenterCesar[]> {
    return this.budgetAccountService.getCostCenters();
  }

  @Get('accounting-accounts/:costCenterId')
  getAccountingAccountByCostCenter(
    @Param('costCenterId') costCenterId: number,
  ): Promise<AccountingAccounts[]> {
    return this.budgetAccountService.getAccountingAccountByCostCenter(
      costCenterId,
    );
  }

  @Get('budget-account/balance/:year/:costCenter/:accountingAccount/:month')
  checkAccountBalance(
    @Param('year') year: string,
    @Param('costCenter') costCenter: string,
    @Param('accountingAccount') accountingAccount: string,
    @Param('month') month: string,
  ): Promise<{ totalBudget: number }> {
    return this.budgetAccountService.checkAccountBalance(
      year,
      costCenter,
      accountingAccount,
      month,
    );
  }
}
