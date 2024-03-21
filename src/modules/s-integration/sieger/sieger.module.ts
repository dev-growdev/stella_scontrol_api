import { Module } from '@nestjs/common';
import { SiegerService } from './sieger.service';
import { KnexModule } from 'nestjs-knex';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    KnexModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: (service: ConfigService) => {
        return {
          config: {
            client: service.get('SIEGER_DB_CLIENT'),
            connection: {
              host: service.get('SIEGER_DB_HOST'),
              user: service.get('SIEGER_DB_USER'),
              password: service.get('SIEGER_DB_PASSWORD'),
              database: service.get('SIEGER_DB_DATABASE'),
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [SiegerService],
  exports: [SiegerService],
})
export class SiegerModule {}
