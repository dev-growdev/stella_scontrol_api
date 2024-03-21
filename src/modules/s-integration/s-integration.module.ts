import { Module } from '@nestjs/common';
import { SiegerModule } from './sieger/sieger.module';
import { ReceitawsModule } from './receitaws/receitaws.module';
import { CesarModule } from './cesar/cesar.module';

@Module({
  imports: [SiegerModule, ReceitawsModule, CesarModule]
})
export class SIntegrationModule {}
