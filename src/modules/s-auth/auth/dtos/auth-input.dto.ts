import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthDTO {
  @ApiProperty()
  @IsString({ message: 'Nome deve ser do tipo string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'ID deve ser do tipo string' })
  idUserAd?: string;
}
