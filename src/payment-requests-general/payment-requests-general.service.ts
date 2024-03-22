import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { FilesService } from 'src/shared/services/files.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  FilesCreatedType,
  PaymentRequestCreatedType,
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
    let filesDB: FilesCreatedType[];

    const dirPath = path.join(__dirname, '..', '..', '..', 'files');

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    try {
      await this.prisma.$transaction(async (prisma) => {
        createdPaymentRequest = await prisma.paymentRequestsGeneral.create({
          data: {
            description: paymentRequestGeneralDTO.description,
            supplier: paymentRequestGeneralDTO.supplier,
            sendReceipt: paymentRequestGeneralDTO.sendReceipt,
            bankTransfer: JSON.stringify(paymentRequestGeneralDTO.bankTransfer),
            pix: paymentRequestGeneralDTO.pix,
            paymentsFormUid: paymentRequestGeneralDTO.paymentMethod.uid,
            isRateable: paymentRequestGeneralDTO.isRateable,
            totalValue: Number(paymentRequestGeneralDTO.totalValue),
            accountingAccount: paymentRequestGeneralDTO.accountingAccount,
            userCreatedUid: paymentRequestGeneralDTO.userCreatedUid,
            cardHoldersUid: paymentRequestGeneralDTO.cardHolder?.uid ?? null,
            unregisteredProducts: paymentRequestGeneralDTO.products
              .filter((product) => !product.uid)
              .map((product) => product.name),
            Products: {
              connect: paymentRequestGeneralDTO.products
                .filter((product) => product.uid)
                .map((product) => ({
                  uid: product.uid,
                })),
            },
            PaymentSchedule: {
              create: paymentRequestGeneralDTO.payments.map((payment) => ({
                value: Number(payment.value),
                dueDate: payment.dueDate,
              })),
            },
            Apportionments: {
              create: paymentRequestGeneralDTO.apportionments.map(
                (apportionment) => ({
                  costCenter: apportionment.costCenter,
                  accountingAccount: apportionment.accountingAccount,
                  value: Number(apportionment.value),
                }),
              ),
            },
          },
          select: {
            uid: true,
            description: true,
            supplier: true,
            bankTransfer: true,
            totalValue: true,
            pix: true,
            accountingAccount: true,
            isRateable: true,
            sendReceipt: true,
            createdAt: true,
            user: {
              select: {
                uid: true,
                name: true,
                enable: true,
                email: true,
              },
            },
            PaymentSchedule: {
              select: {
                uid: true,
                value: true,
                dueDate: true,
              },
            },
            Apportionments: true,
            Products: true,
            unregisteredProducts: true,
            PaymentForm: true,
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
      });

      return createdPaymentRequest;
    } catch (error) {
      throw new BadRequestException(
        'Algo deu errado, confira os campos e tente novamente.',
      );
    }
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
        bankTransfer: true,
        sendReceipt: true,
        accountingAccount: true,
        pix: true,
        isRateable: true,
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
        Products: true,
        unregisteredProducts: true,
        PaymentForm: true,
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
    let request;

    try {
      await this.prisma.$transaction(async (prisma) => {
        const user = await prisma.user.findUnique({
          where: {
            uid: userUid,
          },
        });

        request = await prisma.paymentRequestsGeneral.findUnique({
          where: {
            uid: requestUid,
          },
        });

        request = await prisma.paymentRequestsGeneral.update({
          where: {
            uid: requestUid,
          },
          data: {
            description: updateData.description,
            supplier: updateData.supplier,
            sendReceipt: updateData.sendReceipt,
            totalValue: updateData.totalValue,
            accountingAccount: updateData.accountingAccount,
            PaymentSchedule: {
              update: updateData.paymentSchedules.map((scheduled) => ({
                where: {
                  uid: scheduled.uid,
                },
                data: {
                  value: scheduled.value,
                  dueDate: scheduled.dueDate,
                },
              })),
            },
            Apportionments: {
              update: updateData.apportionments.map((apportionment) => ({
                where: {
                  uid: apportionment.uid,
                },
                data: {
                  costCenter: apportionment.costCenter,
                  accountingAccount: apportionment.accountingAccount,
                  value: new Prisma.Decimal(apportionment.value),
                },
              })),
            },
          },
          select: {
            uid: true,
            description: true,
            supplier: true,
            totalValue: true,
            accountingAccount: true,
            sendReceipt: true,
            createdAt: true,
            user: {
              select: {
                uid: true,
                name: true,
                enable: true,
                email: true,
              },
            },
            PaymentSchedule: {
              select: {
                uid: true,
                value: true,
                dueDate: true,
              },
            },
            Apportionments: true,
          },
        });

        const totalValueFromPaymentsSchedule = request.PaymentSchedule.reduce(
          (total, payment) => {
            return total + payment.value;
          },
          0,
        );

        const totalValueFromApportionments = request.Apportionments.reduce(
          (total, apportionment) => {
            return total + apportionment.value;
          },
          0,
        );

        if (
          (totalValueFromPaymentsSchedule || totalValueFromApportionments) !==
          parseFloat(request.totalValue)
        ) {
          throw new BadRequestException(
            'O valor total do agendamento de pagamento não confere com o valor total da solicitação.',
          );
        }
      });

      return request;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
