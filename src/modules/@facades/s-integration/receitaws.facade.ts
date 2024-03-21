import { ReceitawsService } from '@/modules/s-integration/receitaws/receitaws.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReceitawsFacade {
  constructor(private readonly receitawsService: ReceitawsService) {}

  async findSupplierByCNPJ(cnpj: string) {
    return this.receitawsService.findSupplierByCNPJ(cnpj);
  }
}
