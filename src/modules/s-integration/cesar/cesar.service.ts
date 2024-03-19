import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nestjs-knex';
import {
  AccountingAccountsByCostCenterDto,
  CheckAccountBalanceForOperationDto,
  CostCenterDto,
} from './dto/cesar-output.dto';

@Injectable()
export class CesarService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async getCostCenters(): Promise<CostCenterDto[]> {
    const result = await this.knex('centro_custo').select(['id', 'conta_cc']);

    return result.map((costCenter) => ({
      id: costCenter.id,
      name: costCenter.conta_cc,
    }));
  }

  async getAccountingAccountsByCostCenter(
    costCenterId: number,
  ): Promise<AccountingAccountsByCostCenterDto[]> {
    const result = await this.knex('centro_custo')
      .select('contas_contabeis.id', 'conta_contabil')
      .join('contas_contabeis', 'conta_cc', 'centro_custo')
      .where('centro_custo.id', costCenterId);

    return result.map((result) => ({
      id: result.id,
      name: result.conta_contabil,
    }));
  }

  async checkAccountBalanceForOperation(
    year: string,
    costCenter: string,
    accountingAccount: string,
    month: string,
  ): Promise<CheckAccountBalanceForOperationDto> {
    const result = await this.knex('orcamento')
      .sum({ total: month })
      .where('ano_orcamento', year)
      .where('centro_custo', costCenter)
      .where('conta_contabil', accountingAccount)
      .first();

    return { totalBudget: result?.total ?? 0 };
  }
}
