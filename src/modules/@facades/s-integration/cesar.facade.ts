import { Injectable } from '@nestjs/common';
import { CesarService } from '@/modules/s-integration/cesar/cesar.service';
import {
  AccountingAccountsByCostCenterDto,
  CheckAccountBalanceForOperationDto,
  CostCenterDto,
} from '@/modules/s-integration/cesar/dto/cesar-output.dto';

@Injectable()
export class CesarFacade {
  constructor(private readonly cesarService: CesarService) {}

  async getCostCenters(): Promise<CostCenterDto[]> {
    return this.cesarService.getCostCenters();
  }

  async getAccountingAccountsByCostCenter(
    costCenterId: number,
  ): Promise<AccountingAccountsByCostCenterDto[]> {
    return this.cesarService.getAccountingAccountsByCostCenter(costCenterId);
  }

  async checkAccountBalanceForOperation(
    year: string,
    costCenter: string,
    accountingAccount: string,
    month: string,
  ): Promise<CheckAccountBalanceForOperationDto> {
    return this.cesarService.checkAccountBalanceForOperation(
      year,
      costCenter,
      accountingAccount,
      month,
    );
  }

  async updateTotalBudget(
    year: string,
    costCenter: string,
    accountingAccount: string,
    month: string,
    newTotal: number,
  ) {
    return this.cesarService.updateTotalBudget(
      year,
      costCenter,
      accountingAccount,
      month,
      newTotal,
    );
  }
}
