import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { IntegrationsModule } from '../integrations/integration.module';
import { SupplierService } from './supplier.service';

@Module({
  imports: [IntegrationsModule],
  controllers: [SupplierController],
  providers: [SupplierService],
})
export class SupplierModule {}
