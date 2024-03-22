import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/modules/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import { FilesService } from 'src/shared/services/files.service';
import {
  FilesCreatedType,
  PaymentRequestCreatedType,
  ValidatePaymentRequestGeneralDto,
} from './dto/payment-requests-general-input.dto';

@Injectable()
export class PaymentRequestsGeneralService {
  constructor(
    private prisma: PrismaService,
    private filesService: FilesService,
  ) {}

  async create(
    paymentRequestGeneralDTO: ValidatePaymentRequestGeneralDto,
    files: Express.Multer.File[],
  ) {
    if (files.length === 0) {
      throw new BadRequestException('É necessário anexar documentos.');
    }

    let createdPaymentRequest: PaymentRequestCreatedType;
    let filesDB: FilesCreatedType[];

    const dirPath = path.join(__dirname, '..', '..', '..', '..', '..', 'files');

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    try {
      await this.prisma.$transaction(async (prisma) => {
        createdPaymentRequest = await prisma.scPaymentRequestsGeneral.create({
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
            paymentSchedule: {
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
            totalValue: true,
            sendReceipt: true,
            createdAt: true,
            Products: true,
            user: {
              select: {
                uid: true,
                name: true,
                enable: true,
                email: true,
              },
            },
            cardHolder: true,
            paymentSchedule: {
              select: {
                uid: true,
                value: true,
                dueDate: true,
              },
            },
            paymentRequestsFiles: {
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
            prisma.scPaymentRequestsFiles.create({
              data: {
                filesUid: file.uid,
                paymentRequestsGeneralUid: createdPaymentRequest.uid,
              },
            }),
          ),
        );
      });

      return { ...createdPaymentRequest, ...filesDB };
    } catch (error) {
      throw new BadRequestException(
        'Algo deu errado, confira os campos e tente novamente.',
      );
    }
  }

  async listByUser(userUid: string) {
    const findUser = await this.prisma.saUser.findUnique({
      where: {
        uid: userUid,
      },
    });
    if (!findUser) {
      throw new BadRequestException('Não foi possível encontrar um usuário.');
    }

    const findRequests = await this.prisma.scPaymentRequestsGeneral.findMany({
      where: {
        userCreatedUid: findUser.uid,
      },
      select: {
        uid: true,
        description: true,
        supplier: true,
        totalValue: true,
        sendReceipt: true,
        unregisteredProducts: true,
        accountingAccount: true,
        createdAt: true,
        Products: true,
        user: {
          select: {
            uid: true,
            name: true,
            enable: true,
            email: true,
          },
        },
        cardHolder: true,
        paymentSchedule: {
          select: {
            uid: true,
            value: true,
            dueDate: true,
          },
        },
        paymentRequestsFiles: {
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
      payments: request.paymentSchedule,
      files: request.paymentRequestsFiles.map((file) => file.fileUid),
      apportionments: request.Apportionments,
    }));

    return transformedRequests;
  }

  async listPaymentRequest(userUid: string, uid: string) {
    const findUser = await this.findUser(userUid);

    const findRequestGeneral =
      await this.prisma.scPaymentRequestsGeneral.findUnique({
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
      const findRequests = await this.prisma.scPaymentRequestsGeneral.findMany({
        where: {
          userCreatedUid: findUser.uid,
        },
        select: {
          uid: true,
          description: true,
          supplier: true,
          totalValue: true,
          sendReceipt: true,
          createdAt: true,
          Products: true,
          user: {
            select: {
              uid: true,
              name: true,
              enable: true,
              email: true,
            },
          },
          cardHolder: true,
          paymentSchedule: {
            select: {
              uid: true,
              value: true,
              dueDate: true,
            },
          },
          paymentRequestsFiles: {
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
          PaymentForm: true,
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

  private async findUser(userUid: string) {
    const findUser = await this.prisma.saUser.findUnique({
      where: {
        uid: userUid,
      },
    });

    if (!findUser) {
      throw new BadRequestException('Não foi possível encontrar um usuário.');
    }

    return findUser;
  }
}
