import { Controller, Get, Param } from '@nestjs/common';
import { BudgetAccountService } from './budget-account.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Contas Orçamentárias')
@ApiBearerAuth()
@Controller('budget-account')
export class BudgetAccountController {
  constructor(private readonly budgetAccountService: BudgetAccountService) {}

  @Get('cost-centers')
  getCostCenters() {
    return this.budgetAccountService.getCostCenters();
  }

  @Get('accounting-accounts/:costCenterId')
  getAccountingAccountByCostCenter(
    @Param('costCenterId') costCenterId: number,
  ) {
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
}
