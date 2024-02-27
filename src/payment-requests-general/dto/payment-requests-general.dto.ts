import { IsArray, IsNotEmpty } from 'class-validator';

export class PaymentRequestGeneralDTO {
  @IsNotEmpty({ message: 'O fornecedor é obrigatório' })
  supplier: string;

  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  description: string;

  @IsNotEmpty({ message: 'O comprovante é obrigatório' })
  requiredReceipt: boolean;

  @IsArray()
  payments: { value: string; dueDate: Date }[];
}
