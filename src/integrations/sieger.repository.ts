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
        'fcad cid as city',
        'fcad cgc as cnpj',
        'fcad code as code',
        'fcad des as company_name',
        'fcad fan as fantasy_name',
        'fcad bai as district',
        'fcad cep as zip_code',
      ])
      .where('fcad tip', 'F')
      .whereIn('fcad emp', ['SLA', 'SLL', 'STE'])
      .andWhere('fcad cgc', cnpj);

    if (result.length === 0) return undefined;

    return {
      city: result[0].city,
      cnpj: result[0].cnpj,
      district: result[0].district,
      code: result[0].code,
      companyName: result[0].company_name,
      zipCode: result[0].zip_code,
      fantasyName: result[0].fantasy_name,
    };
  }
}
