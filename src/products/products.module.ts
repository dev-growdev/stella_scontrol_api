import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { IntegrationsModule } from 'src/integrations/integration.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [IntegrationsModule],
})
export class ProductsModule { }
