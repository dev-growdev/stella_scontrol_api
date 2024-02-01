import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PaymentRequestGeneralDTO } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentRequestsService {
  constructor(private prisma: PrismaService) {}

  async createPaymentRequestGeneral(paymentRequestGeneralDTO: PaymentRequestGeneralDTO) {
    try {
      const createdPaymentRequest = await this.prisma.$transaction(async (transaction) => {

        const paymentRequestGeneral = await transaction.paymentRequestsGeneral.create({
          data: {
            description: paymentRequestGeneralDTO.description,
            requiredReceipt: paymentRequestGeneralDTO.requiredReceipt,
            totalRequestValue: parseFloat(paymentRequestGeneralDTO.totalRequestValue),
            duoDate: paymentRequestGeneralDTO.dueDate,
          },
        });

        return paymentRequestGeneral;
      });

      return createdPaymentRequest;
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }
}

