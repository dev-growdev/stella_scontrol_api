import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSupplierDto {
  @IsString({ message: 'Deve ser uma string' })
  @IsNotEmpty({ message: 'Campo obrigatório.' })
  name: string;

  @IsString({ message: 'Deve ser uma string' })
  @IsNotEmpty({ message: 'Campo obrigatório.' })
  @IsEmail({}, { message: 'E-mail inválido.' })
  email: string;

  @IsString({ message: 'Deve ser uma string' })
  @IsNotEmpty({ message: 'Campo obrigatório.' })
  continent: string;

  @IsString({ message: 'Deve ser uma string' })
  @IsOptional()
  phoneNumber?: string;

  @IsString({ message: 'Deve ser uma string' })
  @IsOptional()
  address?: string;

  @IsString({ message: 'Deve ser uma string' })
  @IsOptional()
  city?: string;

  @IsString({ message: 'Deve ser uma string' })
  @IsOptional()
  region?: string;

  @IsString({ message: 'Deve ser uma string' })
  @IsOptional()
  country?: string;

  @IsString({ message: 'Deve ser uma string' })
  @IsOptional()
  contactName?: string;

  @IsBoolean()
  /* @Type(() => Boolean) */
  /* @Transform(({value}) => value === "true") */
  enable: boolean;
}
