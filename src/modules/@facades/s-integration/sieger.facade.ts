import { SupplierSieger } from '@/modules/s-integration/sieger/dto/sieger-output.dto';
import { SiegerService } from '@/modules/s-integration/sieger/sieger.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SiegerFacade {
  constructor(private readonly siegerService: SiegerService) {}
  async findSupplierByCPForCNPJ(
    cpfCnpj: string,
  ): Promise<SupplierSieger | undefined> {
    return this.siegerService.findSupplierByCPForCNPJ(cpfCnpj);
  }
}
