import { IsNotEmpty } from 'class-validator';

export class PaymentRequestGeneralDTO {
  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  description: string;

  @IsNotEmpty({ message: 'O comprovante é obrigatório' })
  sendReceipt: boolean;

  @IsNotEmpty({ message: 'O valor total é obrigatório' })
  totalRequestValue: string;

  @IsNotEmpty({ message: 'A data de vencimento é obrigatória' })
  dueDate: Date;
}
