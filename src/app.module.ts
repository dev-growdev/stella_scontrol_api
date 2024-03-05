import {
  BadRequestException,
  Module,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { IntegrationsModule } from './integrations/integration.module';
import { PaymentRequestsGeneralModule } from './payment-requests-general/payment-requests-general.module';
import { ProductsModule } from './products/products.module';
import { EmailModule } from './shared/email/email.module';
import { CustomExceptionFilter } from './shared/exceptions/custom.exception';
import { SupplierModule } from './supplier/supplier.module';
import { UsersModule } from './users/user.module';

/**
 *
 *
 * @export
 * @class AppModule
 *´
 * É o módulo raiz da aplicação.
 * Responsável por importar e declarar os demais módulos
 * e configurar pipes e filtros globais
 *
 * @Module - imports
 *
 * Onde é importado os demais módulos da aplicação
 *
 * @Module - providers
 *
 * Os provedores/serviços que serão utilizados pela aplicação
 *
 * Providers - APP_FILTER
 *
 * Configura o uso do CustomExceptionFilter para personalizar a resposta
 * para exceções não tratadas
 *
 * Providers - APP_PIPE
 *
 * Configura o uso do ValidationPipe que realiza validação de dados
 * useFactory: Permite passar parâmetros ou lógica personalizada para criar, configurar ou modificar
 * o provedor antes de ser injetado em outros componentes
 *
 * - transform: transforma os dados de entrada para o tipo especificado nas anotações de validação.
 *
 * - whitelist: Irá remover quaisquer propriedades da req que não possuam anotações de validação.
 *
 * -
 */
@Module({
  imports: [
    MulterModule.register({
      dest: './files',
    }),
    UsersModule,
    CategoriesModule,
    ProductsModule,
    AuthModule,
    EmailModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    PaymentRequestsGeneralModule,
    IntegrationsModule,
    SupplierModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          whitelist: true,
          forbidNonWhitelisted: true,
          validationError: { target: false },
          exceptionFactory: (errors: ValidationError[] = []) => {
            const errorResponse = {
              invalidFields: [],
              message: 'Existem campos inválidos na requisição',
            };

            errorResponse.invalidFields = errors.map((error) => {
              return {
                field: error.property,
                messages: Object.values(error.constraints).join(', '),
              };
            });

            return new BadRequestException(errorResponse);
          },
        }),
    },
  ],
})
export class AppModule {}
