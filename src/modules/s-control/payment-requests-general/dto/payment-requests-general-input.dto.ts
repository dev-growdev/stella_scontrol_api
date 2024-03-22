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

export class CreatePaymentRequestGeneralDto {
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

export class BankTransferType {
  @IsNotEmpty({ message: 'O fornecedor é obrigatório' })
  @IsString({ message: 'O fornecedor deve ser uma string' })
  bank: string;

  @IsNotEmpty({ message: 'O fornecedor é obrigatório' })
  @IsString({ message: 'O fornecedor deve ser uma string' })
  accountNumber: string;

  @IsNotEmpty({ message: 'O fornecedor é obrigatório' })
  @IsString({ message: 'O fornecedor deve ser uma string' })
  agency: string;

  @IsNotEmpty({ message: 'O fornecedor é obrigatório' })
  @IsString({ message: 'O fornecedor deve ser uma string' })
  accountType: string;

  @IsNotEmpty({ message: 'O fornecedor é obrigatório' })
  @IsString({ message: 'O fornecedor deve ser uma string' })
  cpfOrCnpj: string;
}
export class ValidatePaymentRequestGeneralDto {
  @IsNotEmpty({ message: 'O fornecedor é obrigatório' })
  @IsString({ message: 'O fornecedor deve ser uma string' })
  supplier: string;

  @IsNotEmpty({ message: 'A descrição é obrigatória' })
  @IsString({ message: 'A descrição deve ser uma string' })
  description: string;

  @IsNotEmpty({ message: 'O comprovante é obrigatório' })
  @IsBoolean({ message: 'O comprovante deve ser um booleano' })
  sendReceipt: boolean;

  @IsNotEmpty()
  @IsBoolean({ message: 'O rateio deve ser um booleano' })
  isRateable: boolean;

  @ValidateNested({ each: true })
  @Type(() => BankTransferType)
  bankTransfer?: BankTransferType;

  @IsArray({ message: 'payments deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => PaymentDto)
  payments: PaymentDto[];

  @IsArray()
  unregisteredProducts: string[];

  @IsArray({ message: 'uploadedFiles deve ser um array' })
  uploadedFiles: any[];

  @IsNotEmpty({ message: 'O comprovante é obrigatório' })
  totalValue: string;

  @IsOptional()
  @IsString({ message: 'Conta contábil deve ser uma string' })
  accountingAccount?: string;

  @IsOptional()
  @IsString({ message: 'Conta contábil deve ser uma string' })
  pix?: string;

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
