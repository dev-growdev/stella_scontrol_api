import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { CesarService } from '@/modules/s-integration/cesar/cesar.service';

@Injectable()
export class BudgetAccountService {
  // TODO: Implementar Façade
  constructor(private cesarService: CesarService) {}

  async getCostCenters() {
    try {
      const costCenters = await this.cesarService.getCostCenters();

      return costCenters;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAccountingAccountByCostCenter(costCenterId: number) {
    try {
      const accountingAccount =
        await this.cesarService.getAccountingAccountsByCostCenter(costCenterId);

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
    try {
      const retrievedAccountingAccount =
        await this.cesarService.checkAccountBalanceForOperation(
          year,
          costCenter,
          accountingAccount,
          month,
        );

      if (retrievedAccountingAccount.totalBudget === 0) {
        throw new BadRequestException('Saldo insuficiente');
      }

      return retrievedAccountingAccount;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
