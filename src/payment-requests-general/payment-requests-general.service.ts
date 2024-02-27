import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentRequestGeneralDTO } from './dto';

@Injectable()
export class PaymentRequestsGeneralService {
  constructor(private prisma: PrismaService) {}

  async create(paymentRequestGeneralDTO: PaymentRequestGeneralDTO) {
    const createPaymentRequest =
      await this.prisma.paymentRequestsGeneral.create({
        data: {
          description: paymentRequestGeneralDTO.description,
          supplier: paymentRequestGeneralDTO.supplier,
          requiredReceipt: paymentRequestGeneralDTO.requiredReceipt,
        },
        select: {
          uid: true,
          description: true,
          supplier: true,
          requiredReceipt: true,
        },
      });

    if (!createPaymentRequest) {
      throw new BadRequestException(
        'Algo deu errado, confira os campos e tente novamente.',
      );
    }

    const paymentSchedules = await Promise.all(
      paymentRequestGeneralDTO.payments.map(async (payment) => {
        const createdPaymentSchedule = await this.prisma.paymentSchedule.create(
          {
            data: {
              dueDate: payment.dueDate,
              value: +payment.value,
              paymentRequestsGeneralUid: createPaymentRequest.uid,
            },
            select: {
              uid: true,
              value: true,
              dueDate: true,
            },
          },
        );
        return createdPaymentSchedule;
      }),
    );

    return {
      request: { ...createPaymentRequest, payments: paymentSchedules },
    };
  }
}
