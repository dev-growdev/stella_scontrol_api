import { Controller, Param, Post } from '@nestjs/common';
import { SupplierService } from './supplier.service';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post(':cpfOrCnpj')
  findSupplierByCPForCNPJ(@Param('cpfOrCnpj') cpfOrCnpj: string) {
    return this.supplierService.findSupplierByCPForCNPJ(cpfOrCnpj);
  }
}
