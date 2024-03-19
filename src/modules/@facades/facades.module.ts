import { Module } from '@nestjs/common';
import { ReceitawsModule } from '../s-integration/receitaws/receitaws.module';
import { SiegerModule } from '../s-integration/sieger/sieger.module';
import { CesarModule } from '../s-integration/cesar/cesar.module';
import { ReceitawsService } from '../s-integration/receitaws/receitaws.service';
import { ReceitawsFacade } from './s-integration/receitaws.facade';

@Module({
  imports: [ReceitawsModule, SiegerModule, CesarModule],
  providers: [ReceitawsFacade, ReceitawsService],
  exports: [ReceitawsFacade],
})
export class FacadesModule {}
