import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { CustomExceptionFilter } from './shared/exceptions';
import { CustomResponseInterceptor } from './shared/response';

/**
 * bootstrap():
 * Ponto de entrada da aplicação
 *
 * NestFactory.create():
 * Cria uma instância da aplicação
 *
 * setGlobalPrefix():
 * Aplicação utilizará um prefixo global
 *
 * `Exemplo`: localhost:8080/api
 *
 * listen():
 * Número da porta onde a aplicação irá roda
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Application');

  logger.log('App started at http://localhost:8080/api');

  app.useGlobalFilters(new CustomExceptionFilter());
  
  app.useGlobalInterceptors(new CustomResponseInterceptor());

  app.setGlobalPrefix('api');

  await app.listen(8080);
}

bootstrap();
