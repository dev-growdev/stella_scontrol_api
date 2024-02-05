import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaymentRequestGeneralDTO } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentRequestsGeneralService {
  constructor(private prisma: PrismaService) {}

  async create(paymentRequestGeneralDTO: PaymentRequestGeneralDTO) {
    try {
      const createdPaymentRequestGeneral = await this.prisma.$transaction(async (transaction) => {

        const paymentRequestGeneral = await transaction.paymentRequestsGeneral.create({
          data: {
            description: paymentRequestGeneralDTO.description,
            sendReceipt: paymentRequestGeneralDTO.sendReceipt,
            totalRequestValue: parseFloat(paymentRequestGeneralDTO.totalRequestValue),
            dueDate: paymentRequestGeneralDTO.dueDate,
          },
        });

        return paymentRequestGeneral;
      });

      return createdPaymentRequestGeneral;
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }
}

