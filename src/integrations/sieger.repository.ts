import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nestjs-knex';
import { SupplierSieger } from './dto/sieger.dto';

@Injectable()
export class SiegerRepository {
  constructor(
    @InjectConnection('dbConnectionSieger') private readonly knex: Knex,
  ) { }

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
