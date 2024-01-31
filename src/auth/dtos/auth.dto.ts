import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

import {
  IsCPForCNPJ,
  IsSecurePassword,
  RemoveSpecialCharacters,
} from 'src/shared/utils';
import { User } from 'src/shared/models';

/**
 * ! Para usar o class-validator o DTO precisa ser declarado como classe e não como interface ou type.
 *
 */
export class AuthDTO {
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  email: string;

  @IsString({ message: 'Campo senha deve ser do tipo string' })
  @IsNotEmpty({ message: 'Senha é obrigatório' })
  @MinLength(6, {
    message: 'Senha deve possuir no mínimo 6 dígitos',
  })
  // @IsSecurePassword() - Validação para senha forte
  password: string;

  @IsString({ message: 'Nome deve ser do tipo string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(3, {
    message: 'Nome é muito curto',
  })
  @MaxLength(150, {
    message: 'Nome é muito longo',
  })
  name: string;

  @IsString()
  @IsPhoneNumber('BR')
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @Transform(RemoveSpecialCharacters)
  phone: string;

  @IsOptional()
  @IsString()
  @Transform(RemoveSpecialCharacters)
  @IsCPForCNPJ()
  document?: string;
}

export interface AuthUser {
  user: User;
  token: string;
}
