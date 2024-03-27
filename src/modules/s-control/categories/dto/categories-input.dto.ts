import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';
export class CreateCategoryDto {
  @IsString({ message: 'Nome deve ser do tipo string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsBoolean({ message: 'Habilitado deve ser do tipo boolean' })
  @IsNotEmpty({ message: 'Habilitado é obrigatório' })
  enable: boolean;
}

export class UpdateCategoryDto extends CreateCategoryDto {}

export class ParamDto {
  @IsString({ message: 'Uid deve ser do tipo string' })
  @IsNotEmpty({ message: 'Uid é obrigatório' })
  @IsUUID('4', { message: 'Uid deve ser um UUID' })
  uid: string;
}

export class DisableCategoryDto {
  @IsBoolean({ message: 'Habilitado deve ser do tipo boolean' })
  @IsNotEmpty({ message: 'Habilitado é obrigatório' })
  enable: boolean;
}
