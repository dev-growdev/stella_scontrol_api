import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@shared/modules/prisma/prisma.service';

@Injectable()
export class PaymentsFormService {
  constructor(private prisma: PrismaService) {}

  // TODO: Entender o que é retornado e criar Dto
  async findAllPaymentsForm() {
    try {
      const findAllPaymentsForm = await this.prisma.scPaymentsForm.findMany({
        select: {
          uid: true,
          name: true,
          enable: true,
        },
      });

      const findHolders = await this.prisma.scCardHolders.findMany({
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
    const holder = await this.prisma.scCardHolders.findUnique({
      where: { uid },
    });

    if (!holder) {
      const findPaymentForm = await this.prisma.scPaymentsForm.findUnique({
        where: { uid },
      });

      if (!findPaymentForm) {
        throw new NotFoundException(
          'Forma de pagamento ou portador não encontrado.',
        );
      }

      const updatePaymentForm = await this.prisma.scPaymentsForm.update({
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

    const disableHolder = await this.prisma.scCardHolders.update({
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
