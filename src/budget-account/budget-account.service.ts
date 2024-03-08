import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CesarRepository } from '../integrations/cesar.repository';

@Injectable()
export class BudgetAccountService {
  constructor(private cesarRepository: CesarRepository) {}

  async getCostCenters() {
    try {
      const costCenters = await this.cesarRepository.getCostCenters();

      return costCenters;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAccountingAccountByCostCenter(costCenterId: number) {
    try {
      const accountingAccount =
        await this.cesarRepository.getAccountingAccountsByCostCenter(
          costCenterId,
        );

      return accountingAccount;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async checkAccountBalance(
    year: string,
    costCenter: string,
    accountingAccount: string,
    month: string,
  ) {
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
}
