import { BadRequestException, Injectable } from '@nestjs/common';
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

  private async findUser(userUid: string) {
    const findUser = await this.prisma.user.findUnique({
      where: {
        uid: userUid,
      },
    });

    if (!findUser) {
      throw new BadRequestException('Não foi possível encontrar um usuário.');
    }

    return findUser;
  }

  async listByUser(userUid: string) {
    const findUser = await this.findUser(userUid);

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

  async listPaymentRequest(userUid: string, uid: string) {
    const findUser = await this.findUser(userUid);

    const findRequestGeneral =
      await this.prisma.paymentRequestsGeneral.findUnique({
        where: {
          uid: uid,
        },
      });

    if (!findRequestGeneral) {
      throw new BadRequestException(
        'Não foi possível encontrar a solicitação de pagamento.',
      );
    }

    try {
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

      return findRequests;
    } catch (error) {
      throw new Error('Ocorreu um erro ao processar a solicitação.');
    }
  }
}
