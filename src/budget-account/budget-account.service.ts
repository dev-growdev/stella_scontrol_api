import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  AccountingAccounts,
  CostCenterCesar,
} from 'src/integrations/dto/cesar.dto.ts';
import { CesarRepository } from '../integrations/cesar.repository';

@Injectable()
export class BudgetAccountService {
  constructor(private cesarRepository: CesarRepository) {}

  async getCostCenters(): Promise<CostCenterCesar[]> {
    try {
      const costCenters = await this.cesarRepository.getCostCenters();

      return costCenters;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAccountingAccountByCostCenter(
    costCenterId: number,
  ): Promise<AccountingAccounts[]> {
    try {
      const accountingAccount =
        await this.cesarRepository.getAccountingAccountsByCostCenter(
          costCenterId,
        );

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
        await this.cesarRepository.checkAccountBalanceForOperation(
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

  async updateTotalBudget(
    year: string,
    costCenter: string,
    accountingAccount: string,
    month: string,
    request: { totalValue: number; canceled: boolean },
  ) {
    try {
      const currentBudget = await this.checkAccountBalance(
        year,
        costCenter,
        accountingAccount,
        month,
      );

      let newTotal = currentBudget.totalBudget;

      if (request.canceled) {
        newTotal += request.totalValue;
      } else {
        newTotal -= request.totalValue;
      }

      await this.cesarRepository.updateTotalBudget(
        year,
        costCenter,
        accountingAccount,
        month,
        newTotal,
      );
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
