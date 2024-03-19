import { Module } from '@nestjs/common';
import { CesarService } from './cesar.service';
import { KnexModule } from 'nestjs-knex';
import { knexConfigCesar } from './knexconfig';

@Module({
  imports: [KnexModule.forRoot({ config: knexConfigCesar })],
  providers: [CesarService],
  exports: [CesarService],
})
export class CesarModule {}
