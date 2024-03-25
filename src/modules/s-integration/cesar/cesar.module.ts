import { Module } from '@nestjs/common';
import { CesarService } from './cesar.service';
import { KnexModule } from 'nestjs-knex';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    KnexModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: (service: ConfigService) => {
        return {
          config: {
            client: service.get('CESAR_DB_CLIENT'),
            connection: {
              host: service.get('CESAR_DB_HOST'),
              user: service.get('CESAR_DB_USER'),
              password: service.get('CESAR_DB_PASSWORD'),
              database: service.get('CESAR_DB_DATABASE'),
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [CesarService],
  exports: [CesarService],
})
export class CesarModule {}
