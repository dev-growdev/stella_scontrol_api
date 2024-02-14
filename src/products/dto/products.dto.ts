import {
  IsNotEmpty,
  IsBoolean,
  IsString,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class ProductDTO {
  @IsString({ message: 'ID da categoria deve ser do tipo string' })
  @IsNotEmpty({ message: 'ID da categoria é obrigatório' })
  categoryId: string;

  @IsString({ message: 'Código deve ser do tipo string' })
  @IsNotEmpty({ message: 'Código é obrigatório' })
  code: string;

  @IsString({ message: 'Nome deve ser do tipo string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsBoolean({ message: 'Habilitado deve ser do tipo boolean' })
  @IsNotEmpty({ message: 'Habilitado é obrigatório' })
  enable: boolean;

  @IsString({ message: 'Unidade de medida deve ser do tipo string' })
  @IsOptional({ message: 'Unidade de medida é opcional' })
  measurement?: string;

  @IsNumber()
  @IsOptional({ message: 'Unidade de medida é opcional' })
  quantity?: number;
}
