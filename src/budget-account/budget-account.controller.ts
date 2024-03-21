import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import {
  AccountingAccounts,
  CostCenterCesar,
} from '../integrations/dto/cesar.dto.ts';
import { BudgetAccountService } from './budget-account.service';

@Controller('budget-account')
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

  @Get('balance/:year/:costCenter/:accountingAccount/:month')
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

  @Patch('update-total-budget/:year/:costCenter/:accountingAccount/:month')
  updateTotalBudget(
    @Param('year') year: string,
    @Param('costCenter') costCenter: string,
    @Param('accountingAccount') accountingAccount: string,
    @Param('month') month: string,
    @Body() request: { totalValue: number; canceled: boolean },
  ) {
    return this.budgetAccountService.updateTotalBudget(
      year,
      costCenter,
      accountingAccount,
      month,
      request,
    );
  }
}
