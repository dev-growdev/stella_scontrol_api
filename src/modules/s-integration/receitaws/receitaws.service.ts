import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { SupplierReceitaws } from './dto/receitaws-output.dto';

@Injectable()
export class ReceitawsService {
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
      };
    } catch (error) {
      return undefined;
    }
  }
}
