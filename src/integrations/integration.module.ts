import { Module } from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';
import { CesarRepository } from './cesar.repository';
import { knexConfigCesar, knexConfigSieger } from './knexconfig';
import { ReceitawsRepository } from './receitaws.repository';
import { SiegerRepository } from './sieger.repository';

@Module({
  imports: [
    KnexModule.forRootAsync(
      {
        useFactory: () => ({
          config: knexConfigSieger,
        }),
      },
      'dbConnectionSieger',
    ),
    KnexModule.forRootAsync(
      {
        useFactory: () => ({
          config: knexConfigCesar,
        }),
      },
      'dbConnectionCesar',
    ),
  ],
  providers: [SiegerRepository, ReceitawsRepository, CesarRepository],
  exports: [SiegerRepository, ReceitawsRepository, CesarRepository],
})
export class IntegrationsModule { }
