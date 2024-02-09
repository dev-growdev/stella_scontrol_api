import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CategoriesDTO {
  @IsString({ message: 'Nome deve ser do tipo string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsBoolean({message: 'Habilitado debe ser do tipo boolean'})
  @IsNotEmpty({ message: 'Habilitado é obrigatório' })
  enable: boolean;
}
