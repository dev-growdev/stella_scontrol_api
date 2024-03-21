import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { InjectConnection } from 'nestjs-knex';
import { SupplierSieger } from './dto/sieger-output.dto';

@Injectable()
export class SiegerService {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async findSupplierByCPForCNPJ(
    cpfCnpj: string,
  ): Promise<SupplierSieger | undefined> {
    const result = await this.knex('02970s001.cadastro_fornecedor')
      .select(['CNPJ_CPF as cpf_cnpj', 'Razao_social as name'])
      .where('CNPJ_CPF', cpfCnpj)
      .first();

    if (!result) return undefined;

    return {
      cpfCnpj: result.cpf_cnpj,
      name: result.name,
    };
  }
}
