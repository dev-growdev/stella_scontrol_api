import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * ! Para usar o class-validator o DTO precisa ser declarado como classe e não como interface ou type.
 *
 */
export class AuthDTO {
  @IsString({ message: 'Nome deve ser do tipo string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  email: string;

  @IsString({ message: 'ID deve ser do tipo string' })
  idUserAd?: string;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  enable: boolean;
  phone: string;
  document?: string;
}

export interface AuthUser {
  user: User;
  token: string;
}
