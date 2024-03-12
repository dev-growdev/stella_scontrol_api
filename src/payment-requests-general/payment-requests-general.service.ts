import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { FilesService } from 'src/shared/services/files.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  FilesCreatedType,
  PaymentRequestCreatedType,
  PaymentScheduleCreatedType,
  ValidatePaymentRequestGeneralDTO,
} from './dto';

@Injectable()
export class PaymentRequestsGeneralService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

  async create(
    paymentRequestGeneralDTO: ValidatePaymentRequestGeneralDTO,
    files: Express.Multer.File[],
  ) {
    if (files.length === 0) {
      throw new BadRequestException('É necessário anexar documentos.');
    }

    let createdPaymentRequest: PaymentRequestCreatedType;
    let paymentSchedules: PaymentScheduleCreatedType[];
    let filesDB: FilesCreatedType[];

    const dirPath = path.join(__dirname, '..', '..', '..', 'files');

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    try {
      await this.prisma.$transaction(async (prisma) => {
        const uploadedFiles = await Promise.all(
          files.map(async (file) => {
            const createdFile = await this.filesService.createFileOnDB(file);

            const fileStream = fs.createWriteStream(
              `${dirPath}/${createdFile.key}`,
            );

            fileStream.write(file.buffer);

            fileStream.end();

            return createdFile;
          }),
        );

        filesDB = uploadedFiles;

        createdPaymentRequest = await prisma.paymentRequestsGeneral.create({
          data: {
            description: paymentRequestGeneralDTO.description,
            supplier: paymentRequestGeneralDTO.supplier,
            requiredReceipt: paymentRequestGeneralDTO.requiredReceipt,
            totalValue: paymentRequestGeneralDTO.totalValue,
            accountingAccount: paymentRequestGeneralDTO.accountingAccount,
          },
          select: {
            uid: true,
            description: true,
            supplier: true,
            requiredReceipt: true,
          },
        });

        await Promise.all(
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
