import { Module } from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';

import { SiegerRepository } from './sieger.repository';
import { knexConfig } from './knexconfig';

@Module({
  imports: [
    KnexModule.forRoot({
      config: knexConfig,
    }),
  ],
  providers: [SiegerRepository],
  exports: [SiegerRepository],
})
export class IntegrationsModule { }
