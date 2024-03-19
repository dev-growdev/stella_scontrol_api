import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

function joinConstraints(constraints: Record<string, string>) {
  return Object.values(constraints).join(', ');
}
export class ClassValidatorPipe {
  constructor() {
    return new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false },
      exceptionFactory: (errors: ValidationError[] = []) => {
        const errorResponse = {
          invalidFields: [],
          message: 'There are invalid fields in the request',
        };

        errorResponse.invalidFields = errors.map((error) => {
          // Validação simples de um campo
          if (!error.children || error.children?.length === 0) {
            return {
              field: error.property,
              messages: joinConstraints(error.constraints),
            };
          }

          const invalidProperties: Record<string, string> = {};
          error.children?.forEach((c) => {
            // Validação de um campo que é um objeto
            if (!c.children || c.children?.length === 0) {
              // formata o nome do campo para o nome `objeto.campo`
              const field = `${error.property}.${c.property}`;
              const messages = joinConstraints(c.constraints);

              invalidProperties[field] = messages;

              return;
            }

            // Validação de um campo que é um array de objetos
            c.children.forEach((cc) => {
              invalidProperties[cc.property] = joinConstraints(cc.constraints);
            });
          });

          // formata retorno em um array de objetos
          const fields = Object.keys(invalidProperties);
          const returns = fields.map((field) => ({
            field,
            messages: invalidProperties[field],
          }));

          return returns;
        });

        // remove arrays aninhados
        errorResponse.invalidFields =
          errorResponse.invalidFields.flat(Infinity);

        return new BadRequestException(errorResponse);
      },
    });
  }
}
