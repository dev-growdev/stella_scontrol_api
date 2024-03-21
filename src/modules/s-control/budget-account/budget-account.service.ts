import { CesarFacade } from '@/modules/@facades/s-integration/cesar.facade';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class BudgetAccountService {
  constructor(private cesarFacade: CesarFacade) {}

  async getCostCenters() {
    try {
      const costCenters = await this.cesarFacade.getCostCenters();

      return costCenters;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAccountingAccountByCostCenter(costCenterId: number) {
    try {
      const accountingAccount =
        await this.cesarFacade.getAccountingAccountsByCostCenter(costCenterId);

      if (accountingAccount.length === 0) {
        throw new NotFoundException(
          'Conta não encontrada para o centro de custo especificado',
        );
      }

      return accountingAccount;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async checkAccountBalance(
    year: string,
    costCenter: string,
    accountingAccount: string,
    month: string,
  ): Promise<{ totalBudget: number }> {
    const retrievedAccountingAccount =
      await this.cesarFacade.checkAccountBalanceForOperation(
        year,
        costCenter,
        accountingAccount,
        month,
      );

    if (retrievedAccountingAccount.totalBudget === 0) {
      throw new BadRequestException('Saldo insuficiente');
    }

    return retrievedAccountingAccount;
  }
}
