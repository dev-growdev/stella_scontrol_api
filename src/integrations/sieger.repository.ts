// sieger.repository.ts
import { Injectable } from '@nestjs/common';

import { SupplierSieger } from './dto/sieger.dto';
import { Knex } from 'knex';
import { InjectConnection } from 'nestjs-knex';

@Injectable()
export class SiegerRepository {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async findSupplierByCPForCNPJ(
    cpfCnpj: string,
  ): Promise<SupplierSieger | undefined> {
    const result = await this.knex('02970s001.cadastro_fornecedor')
      .select(['CNPJ_CPF as cpf_cnpj', 'Razao_social as name'])
      .where('CNPJ_CPF', cpfCnpj);

    if (result.length === 0) return undefined;

    return {
      cpfCnpj: result[0].cpf_cnpj,
      name: result[0].name,
    };
  }
}
