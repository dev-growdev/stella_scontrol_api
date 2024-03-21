import { Module } from '@nestjs/common';
import { SiegerService } from './sieger.service';
import { KnexModule } from 'nestjs-knex';
import { knexConfigSieger } from './knexConfig';

@Module({
  imports: [
    KnexModule.forRoot({
      config: knexConfigSieger,
    }),
  ],
  providers: [SiegerService],
  exports: [SiegerService],
})
export class SiegerModule {}
