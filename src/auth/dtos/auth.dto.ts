import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from 'class-validator';
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
  password: string;

  @IsString({ message: 'Token deve ser do tipo string' })
  @IsNotEmpty({ message: 'Token é obrigatório' })
  token: string;
}

export interface AuthUser {
  user: User;
  token: string;
}
