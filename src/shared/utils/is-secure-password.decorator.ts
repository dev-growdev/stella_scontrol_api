import { BadRequestException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isSecurePassword', async: false })
export class IsSecurePasswordConstraint
  implements ValidatorConstraintInterface
{
  validate(password: string, args: ValidationArguments) {
    // Verifica se a senha possui ao menos um número (\d) e ao menos um caractere especial ([!@#$%^&*()_+])
    const isSecurePass = /^(?=.*\d)(?=.*[!@#$%^&*()_+])/.test(password);

    if (!isSecurePass) {
      throw new BadRequestException(this.defaultMessage(args));
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `A senha deve possuir ao menos um número e ao menos um caractere especial.`;
  }
}

export function IsSecurePassword(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'isSecurePassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsSecurePasswordConstraint,
    });
  };
}
