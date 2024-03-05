import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

class PaymentDto {
  @IsNotEmpty({ message: 'O valor do pagamento é obrigatório' })
  @IsString({ message: 'O valor do pagamento deve ser uma string' })
  value: string;

  @IsNotEmpty({ message: 'A data de vencimento do pagamento é obrigatória' })
  dueDate: Date;
}

export class PaymentRequestGeneralDTO {
  @IsNotEmpty({ message: 'O documento é obrigatório' })
  @IsString({ message: 'O documento deve ser uma string' })
  document: string;
}

export class ValidatePaymentRequestGeneralDTO {
  @IsNotEmpty({ message: 'O fornecedor é obrigatório' })
  @IsString({ message: 'O fornecedor deve ser uma string' })
  supplier: string;

  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @IsString({ message: 'A descrição deve ser uma string' })
  description: string;

  @IsNotEmpty({ message: 'O comprovante é obrigatório' })
  @IsBoolean({ message: 'O comprovante deve ser um booleano' })
  requiredReceipt: boolean;

  @IsArray({ message: 'payments deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => PaymentDto)
  payments: PaymentDto[];

  @IsArray({ message: 'uploadedFiles deve ser um array' })
  uploadedFiles: any[];
}
