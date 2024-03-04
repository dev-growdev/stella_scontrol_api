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

      return findAllPaymentsForm;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async disablePaymentsForm(uid: string) {
    const paymentForm = await this.prisma.paymentsForm.findUnique({
      where: { uid },
    });

    if (!paymentForm) {
      throw new NotFoundException('Forma de pagamento não encontrado.');
    }

    try {
      const disablePaymentForm = await this.prisma.paymentsForm.update({
        where: { uid },
        data: {
          enable: !paymentForm.enable,
        },
        select: {
          uid: true,
          name: true,
          enable: true,
        },
      });

      return disablePaymentForm;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
