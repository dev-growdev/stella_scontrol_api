import { BadRequestException, Injectable } from '@nestjs/common';
import { AWSService } from 'src/shared/services/aws.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentRequestsGeneralService {
  constructor(private prisma: PrismaService, private aws: AWSService) {}

  async create(paymentRequestGeneralDTO: any, files: Express.Multer.File[]) {
    //utilizar o $transaction
    const promise = files.map((file) => {
      const uploadFile = {
        file: file.buffer,
        name: file.originalname,
        contentType: file.mimetype,
      };
      return this.aws.upload(uploadFile);
    });
    const resolved = await Promise.all(promise);

    if (!resolved) {
      throw new BadRequestException(
        'Não foi possível fazer o upload dos arquivos.',
      );
    }

    const createdFilesInDB = resolved.map((file) => {
      return this.prisma.files.create({
        data: {
          key: file,
          name: 'teste',
        },
        select: {
          uid: true,
        },
      });
    });
    const testeFileReturned = await Promise.all(createdFilesInDB);

    const form = JSON.parse(paymentRequestGeneralDTO.document);
    const createPaymentRequest =
      await this.prisma.paymentRequestsGeneral.create({
        data: {
          description: form.description,
          supplier: form.supplier,
          requiredReceipt: form.requiredReceipt,
        },
        select: {
          uid: true,
          description: true,
          supplier: true,
          requiredReceipt: true,
        },
      });

    const vinculaFileToRequest = testeFileReturned.map((file) => {
      return this.prisma.paymentRequestsFiles.create({
        data: {
          filesUid: file.uid,
          paymentRequestsGeneralUid: createPaymentRequest.uid,
        },
      });
    });

    const sera = await Promise.all(vinculaFileToRequest);
    console.log(sera);

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
