// sieger.repository.ts
import { Injectable } from '@nestjs/common';

import { SupplierSieger } from './dto/sieger.dto';
import { Knex } from 'knex';
import { InjectConnection } from 'nestjs-knex';

@Injectable()
export class SiegerRepository {
  constructor(@InjectConnection() private readonly knex: Knex) { }

  async findSupplierByCNPJ(cnpj: string): Promise<SupplierSieger | undefined> {
    const result = await this.knex('02970s001.cadastro_fornecedor')
      .select([
        'CNPJ_CPF as cnpj',
        'Razao_social as name',
        'Nome_fantasia as trade_name',
      ])
      .where('CNPJ_CPF', cnpj);

    if (result.length === 0) return undefined;

    return {
      cnpj: result[0].cnpj,
      name: result[0].name,
      tradeName: result[0].trade_name,
    };
  }
}
