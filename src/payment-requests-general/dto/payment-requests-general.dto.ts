import { Decimal } from '@prisma/client/runtime/library';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PaymentDto {
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

export class ApportionmentsDto {
  @IsNotEmpty({ message: 'É necessário adicionar um centro de custo.' })
  @IsString()
  costCenter: string;

  @IsNotEmpty({ message: 'É necessário adicionar uma conta contábil.' })
  @IsString()
  accountingAccount: string;

  @IsNotEmpty({ message: 'É necessário adicionar um valor.' })
  @IsString()
  value: string;
}

export class CardHolderType {
  @IsString()
  name: string;
  @IsString()
  uid: string;
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

  @IsNotEmpty({ message: 'O comprovante é obrigatório' })
  totalValue: string;

  @IsOptional()
  @IsString({ message: 'Conta contábil deve ser uma string' })
  accountingAccount?: string;

  @IsArray({ message: 'Rateio deve ser um array.' })
  @ValidateNested({ each: true })
  @Type(() => ApportionmentsDto)
  apportionments: ApportionmentsDto[];

  @IsString()
  userCreatedUid: string;

  @IsOptional()
  cardHolder?: CardHolderType;
}

export class PaymentRequestCreatedType {
  uid: string;
  description: string;
  supplier: string;
  requiredReceipt: boolean;
}

export class PaymentScheduleCreatedType {
  uid: string;
  value: number;
  dueDate: Date;
}

export class FilesCreatedType {
  uid: string;
  name: string;
  key: string;
}

export class ApportionmentsCreatedType {
  uid: string;
  accountingAccount: string;
  costCenter: string;
  paymentRequestsGeneralUid: string;
  value: Decimal;
}

export class UpdateRequestGeneral {
  description?: string;
  supplier?: string;
  requiredReceipt?: boolean;
  totalValue?: number;
  accountingAccount?: string;
  CardHolder?: string | null;
}
