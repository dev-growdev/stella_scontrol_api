import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator';

class FileDto {
  @IsString({ message: 'file deve ser uma string' })
  @IsNotEmpty({ message: 'file não pode ser vazio' })
  file: string;

  @IsString({ message: 'name deve ser uma string' })
  @IsNotEmpty({ message: 'name não pode ser vazio' })
  name: string;
}

export class PaymentRequestGeneralDTO {
  @IsNotEmpty({ message: 'O fornecedor é obrigatório' })
  supplier: string;

  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  description: string;

  @IsNotEmpty({ message: 'O comprovante é obrigatório' })
  requiredReceipt: boolean;

  @IsArray()
  payments: { value: string; dueDate: Date }[];

  @IsObject({ message: 'uploadedFiles deve ser um objeto' })
  @IsNotEmpty({ message: 'uploadedFiles não pode ser vazio' })
  @Type(() => FileDto)
  uploadedFiles: FileDto[];
}
