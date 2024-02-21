// sieger.repository.ts
import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';

import { SupplierSieger } from './dto/sieger.dto';

@Injectable()
export class SiegerRepository {
  constructor(private readonly knex: Knex) { }

  async findSupplierByCNPJ(cnpj: string): Promise<SupplierSieger | undefined> {
    const result = await this.knex('fcadas')
      .select([
        'fcad cgc as cnpj',
        'fcad des as name',
        'fcad fan as trade_name',
      ])
      .where('fcad tip', 'F')
      .whereIn('fcad emp', ['SLA', 'SLL', 'STE'])
      .andWhere('fcad cgc', cnpj);

    if (result.length === 0) return undefined;

    return {
      cnpj: result[0].cnpj,
      name: result[0].company_name,
      tradeName: result[0].trade_name,
    };
  }
}
