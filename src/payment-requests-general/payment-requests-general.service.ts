import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ValidatePaymentRequestGeneralDTO } from './dto';

@Injectable()
export class PaymentRequestsGeneralService {
  constructor(private prisma: PrismaService) {}

  async create(
    paymentRequestGeneralDTO: ValidatePaymentRequestGeneralDTO,
    files: Express.Multer.File[],
  ) {
    let createdPaymentRequest;
    let paymentSchedules;
    let filesDB;

    try {
      await this.prisma.$transaction(async (prisma) => {
        const uploadedFiles = await Promise.all(
          files.map(async (file) => {
            const createdFile = await prisma.files.create({
              data: {
                key: file.filename,
                name: file.originalname,
              },
              select: {
                uid: true,
                name: true,
                key: true,
              },
            });

            return createdFile;
          }),
        );

        filesDB = uploadedFiles;

        createdPaymentRequest = await prisma.paymentRequestsGeneral.create({
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

        const vinculaFileToRequest = await Promise.all(
          filesDB.map((file) =>
            prisma.paymentRequestsFiles.create({
              data: {
                filesUid: file.uid,
                paymentRequestsGeneralUid: createdPaymentRequest.uid,
              },
            }),
          ),
        );

        paymentSchedules = await Promise.all(
          paymentRequestGeneralDTO.payments.map(async (payment) =>
            prisma.paymentSchedule.create({
              data: {
                dueDate: payment.dueDate,
                value: +payment.value,
                paymentRequestsGeneralUid: createdPaymentRequest.uid,
              },
              select: {
                uid: true,
                value: true,
                dueDate: true,
              },
            }),
          ),
        );
      });
    } catch (error) {
      throw new BadRequestException(
        'Algo deu errado, confira os campos e tente novamente.',
      );
    }

    return {
      request: {
        ...createdPaymentRequest,
        payments: paymentSchedules,
        files: filesDB,
      },
    };
  }
}
