import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { SiegerRepository } from '../integrations/sieger.repository';
import { IntegrationsModule } from 'src/integrations/integration.module';

@Module({
  imports: [IntegrationsModule],
  controllers: [SupplierController],
  providers: [SiegerRepository],
  exports: [SiegerRepository],
})
export class SupplierModule {}
