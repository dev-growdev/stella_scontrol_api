// sieger.repository.ts
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nestjs-knex';
import { AccountingAccounts, CostCenterCesar } from './dto/cesar.dto.ts';

@Injectable()
export class CesarRepository {
  constructor(
    @InjectConnection('dbConnectionCesar') private readonly knex: Knex,
  ) { }

  async getCostCenters(): Promise<CostCenterCesar[]> {
    const result = await this.knex('centro_custo').select(['id', 'conta_cc']);

    return result.map((costCenter) => ({
      id: costCenter.id,
      name: costCenter.conta_cc,
    }));
  }

  async getAccountingAccountsByCostCenter(
    costCenterId: number,
  ): Promise<AccountingAccounts[]> {
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
  ): Promise<{ totalBudget: number }> {
    const result = await this.knex('orcamento')
      .sum({ total: month as string })
      .where('ano_orcamento', year)
      .where('centro_custo', costCenter)
      .where('conta_contabil', accountingAccount)
      .first();

    return { totalBudget: result?.total ?? 0 };
  }
}
