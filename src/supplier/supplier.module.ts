import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { IntegrationsModule } from 'src/integrations/integration.module';

@Module({
  imports: [IntegrationsModule],
  controllers: [SupplierController],
})
export class SupplierModule { }
