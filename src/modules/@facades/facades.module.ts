import { Module } from '@nestjs/common';
import { ReceitawsModule } from '../s-integration/receitaws/receitaws.module';
import { SiegerModule } from '../s-integration/sieger/sieger.module';
import { CesarModule } from '../s-integration/cesar/cesar.module';
import { ReceitawsFacade } from './s-integration/receitaws.facade';
import { CesarFacade } from './s-integration/cesar.facade';
import { SiegerFacade } from './s-integration/sieger.facade';

@Module({
  imports: [ReceitawsModule, SiegerModule, CesarModule],
  providers: [ReceitawsFacade, CesarFacade, SiegerFacade],
  exports: [ReceitawsFacade, CesarFacade, SiegerFacade],
})
export class FacadesModule {}
