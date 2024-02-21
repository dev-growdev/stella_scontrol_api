// receitaws.repository.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { SupplierReceitaws } from './dto/receitaws.dto';

@Injectable()
export class ReceitawsRepository {
  async findSupplierByCNPJ(
    cnpj: string,
  ): Promise<SupplierReceitaws | undefined> {
    try {
      const response = await axios.get(
        `https://www.receitaws.com.br/v1/cnpj/${cnpj}`,
      );

      if (!response.data || response.data.status === 'ERROR') {
        return undefined;
      }

      return {
        cnpj: response.data.cnpj,
        name: response.data.nome,
        tradeName: response.data.fantasia,
      };
    } catch (error) {
      return undefined;
    }
  }
}
