import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { FacadesModule } from '@/modules/@facades/facades.module';

@Module({
  imports: [FacadesModule],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
