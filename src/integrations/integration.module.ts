import { Module } from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';

import { SiegerRepository } from './sieger.repository';
import { ReceitawsRepository } from './receitaws.repository';
import { knexConfig } from './knexconfig';

@Module({
  imports: [
    KnexModule.forRoot({
      config: knexConfig,
    }),
  ],
  providers: [SiegerRepository, ReceitawsRepository],
  exports: [SiegerRepository, ReceitawsRepository],
})
export class IntegrationsModule { }
