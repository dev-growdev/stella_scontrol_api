import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymentsFormService {
  constructor(private prisma: PrismaService) {}

  async findAllPaymentsForm() {
    try {
      const findAllPaymentsForm = await this.prisma.paymentsForm.findMany({
        select: {
          uid: true,
          name: true,
          enable: true,
        },
      });

      const findHolders = await this.prisma.cardHolders.findMany({
        select: {
          name: true,
          code: true,
          uid: true,
          enable: true,
          type: true,
          paymentForm: {
            select: {
              name: true,
              uid: true,
            },
          },
        },
      });

      return [...findAllPaymentsForm, ...findHolders];
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async disablePaymentsForm(uid: string) {
    const holder = await this.prisma.cardHolders.findUnique({
      where: { uid },
    });

    if (!holder) {
      const findPaymentForm = await this.prisma.paymentsForm.findUnique({
        where: { uid },
      });

      if (!findPaymentForm) {
        throw new NotFoundException(
          'Forma de pagamento ou portador não encontrado.',
        );
      }

      const updatePaymentForm = await this.prisma.paymentsForm.update({
        where: { uid },
        data: {
          enable: !findPaymentForm.enable,
        },
        select: {
          uid: true,
          name: true,
          enable: true,
        },
      });

      return updatePaymentForm;
    }

    const disableHolder = await this.prisma.cardHolders.update({
      where: { uid },
      data: {
        enable: !holder.enable,
      },
      select: {
        uid: true,
        code: true,
        name: true,
        enable: true,
        type: true,
        paymentForm: {
          select: {
            uid: true,
            name: true,
            enable: true,
          },
        },
      },
    });

    return disableHolder;
  }
}
