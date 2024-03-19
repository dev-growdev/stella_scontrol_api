import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { FilesService } from 'src/shared/services/files.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  ApportionmentsCreatedType,
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
    let apportionmentsCreated: ApportionmentsCreatedType[];

    const dirPath = path.join(__dirname, '..', '..', '..', 'files');

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    try {
      await this.prisma.$transaction(async (prisma) => {
        if (paymentRequestGeneralDTO.cardHolder) {
          const existsHolder = await prisma.cardHolders.findUnique({
            where: {
              uid: paymentRequestGeneralDTO.cardHolder.uid,
            },
          });
          if (!existsHolder) {
            throw new BadRequestException(
              'Não foi possível encontrar um portador.',
            );
          }
        }

        createdPaymentRequest = await prisma.paymentRequestsGeneral.create({
          data: {
            description: paymentRequestGeneralDTO.description,
            supplier: paymentRequestGeneralDTO.supplier,
            totalValue: Number(paymentRequestGeneralDTO.totalValue),
            accountingAccount: paymentRequestGeneralDTO.accountingAccount,
            requiredReceipt: paymentRequestGeneralDTO.requiredReceipt,
            userCreatedUid: paymentRequestGeneralDTO.userCreatedUid,
            cardHoldersUid: paymentRequestGeneralDTO.cardHolder?.uid ?? null,
          },
          select: {
            uid: true,
            description: true,
            supplier: true,
            totalValue: true,
            accountingAccount: true,
            requiredReceipt: true,
            createdAt: true,
            user: {
              select: {
                uid: true,
                name: true,
                enable: true,
                email: true,
              },
            },
            CardHolder: true,
          },
        });

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
                value: Number(payment.value),
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

        apportionmentsCreated = await Promise.all(
          paymentRequestGeneralDTO.apportionments.map(async (apportionment) =>
            prisma.apportionments.create({
              data: {
                paymentRequestsGeneralUid: createdPaymentRequest.uid,
                costCenter: apportionment.costCenter,
                accountingAccount: apportionment.accountingAccount,
                value: Number(apportionment.value),
              },
              select: {
                uid: true,
                accountingAccount: true,
                costCenter: true,
                paymentRequestsGeneralUid: true,
                value: true,
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
        apportionments: apportionmentsCreated,
      },
    };
  }

  async listByUser(userUid: string) {
    const findUser = await this.prisma.user.findUnique({
      where: {
        uid: userUid,
      },
    });
    if (!findUser) {
      throw new BadRequestException('Não foi possível encontrar um usuário.');
    }

    const findRequests = await this.prisma.paymentRequestsGeneral.findMany({
      where: {
        userCreatedUid: findUser.uid,
      },
      select: {
        uid: true,
        description: true,
        supplier: true,
        totalValue: true,
        requiredReceipt: true,
        accountingAccount: true,
        createdAt: true,
        user: {
          select: {
            uid: true,
            name: true,
            enable: true,
            email: true,
          },
        },
        CardHolder: true,
        PaymentSchedule: {
          select: {
            uid: true,
            value: true,
            dueDate: true,
          },
        },
        PaymentRequestsFiles: {
          select: {
            fileUid: true,
          },
        },
        Apportionments: {
          select: {
            uid: true,
            accountingAccount: true,
            costCenter: true,
            paymentRequestsGeneralUid: true,
            value: true,
          },
        },
      },
    });

    if (!findRequests.length) {
      throw new BadRequestException(
        'Você não tem nenhuma solicitação geral de pagamento.',
      );
    }

    const transformedRequests = findRequests.map((request) => ({
      ...request,
      payments: request.PaymentSchedule,
      files: request.PaymentRequestsFiles.map((file) => file.fileUid),
      apportionments: request.Apportionments,
    }));

    return transformedRequests;
  }

  async updatePaymentsRequestsByUser(
    userUid: string,
    requestUid: string,
    updateData: any,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { uid: userUid },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const paymentRequestGeneral =
      await this.prisma.paymentRequestsGeneral.findUnique({
        where: { uid: requestUid },
      });

    if (!paymentRequestGeneral) {
      throw new NotFoundException('Solicitação não encontrada.');
    }

    let uploadedFiles;
    let paymentSchedule;
    let updatedApportionments;

    try {
      const updatedPaymentRequest =
        await this.prisma.paymentRequestsGeneral.update({
          where: { uid: requestUid },
          data: {
            description: updateData.description,
            supplier: updateData.supplier,
            requiredReceipt: updateData.requiredReceipt,
            totalValue: updateData.totalValue,
            CardHolder: updateData.cardHolder,
            accountingAccount: updateData.accountingAccount,
          },
          select: {
            uid: true,
            description: true,
            supplier: true,
            totalValue: true,
            requiredReceipt: true,
            accountingAccount: true,
            createdAt: true,
            user: {
              select: {
                uid: true,
                name: true,
                enable: true,
                email: true,
              },
            },
            CardHolder: true,
          },
        });

      if (updateData.files) {
        uploadedFiles = await Promise.all(
          updateData.files.map(async (fileData) => {
            const { createdAt, updatedAt, ...dataWithoutTimestamps } = fileData;
            return this.prisma.files.update({
              where: { uid: fileData.uid },
              data: dataWithoutTimestamps,
              select: {
                uid: true,
                name: true,
                key: true,
              },
            });
          }),
        );
      }

      if (updateData.paymentSchedules) {
        paymentSchedule = await Promise.all(
          updateData.paymentSchedules.map(async (scheduleData) => {
            const { uid, ...data } = scheduleData;
            return this.prisma.paymentSchedule.update({
              where: { uid },
              data,
              select: {
                uid: true,
                value: true,
                dueDate: true,
              },
            });
          }),
        );
      }

      if (updateData.apportionments) {
        updatedApportionments = await Promise.all(
          updateData.apportionments.map(async (apportionmentData) => {
            const { uid, ...data } = apportionmentData;
            return this.prisma.apportionments.update({
              where: { uid },
              data,
              select: {
                uid: true,
                costCenter: true,
                accountingAccount: true,
                value: true,
              },
            });
          }),
        );
      }

      return {
        request: {
          ...updatedPaymentRequest,
          payments: paymentSchedule,
          files: uploadedFiles,
          apportionments: updatedApportionments,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
