import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../../shared/modules/prisma/prisma.service';
import { ValidatePaymentRequestGeneralDto } from './dto/payment-requests-general-input.dto';
import { PaymentRequestsGeneralService } from './payment-requests-general.service';

const makePaymentRequestGeneralDto = (): ValidatePaymentRequestGeneralDto => {
  return {
    supplier: '1234567891011',
    description: 'Solicito pagamento para um equipamento novo.',
    requiredReceipt: true,
    payments: [{ value: '100.50', dueDate: new Date() }],
    uploadedFiles: [],
  };
};

describe('PaymentRequestsGeneralService', () => {
  let sut: PaymentRequestsGeneralService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, PaymentRequestsGeneralService, ConfigService],
    }).compile();

    sut = module.get<PaymentRequestsGeneralService>(
      PaymentRequestsGeneralService,
    );
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('Create - POST', () => {
    it('should create a payment request general and return the created data on success', async () => {
      const paymentRequestGeneralDto = makePaymentRequestGeneralDto();

      jest.spyOn(prisma, '$transaction').mockImplementation(async () => {
        const createdPaymentRequestGeneral = {
          document: {
            supplier: '1234567891011',
            description: 'Solicito pagamento para um equipamento novo.',
            requiredReceipt: true,
            payments: [{ value: '100.50', dueDate: new Date() }],
            uploadedFiles: [],
          },
        };

        return createdPaymentRequestGeneral;
      });

      const createdPaymentRequestGeneral = await sut.create(
        paymentRequestGeneralDto,
        [],
      );

      expect(createdPaymentRequestGeneral).toBeDefined();
      expect(createdPaymentRequestGeneral).toHaveProperty('request');
    });

    it('should throw BadRequestException if there is no file', async () => {
      const paymentRequestGeneralDto = {
        supplier: '1234567891011',
        description: 'Solicito pagamento para um equipamento novo.',
        requiredReceipt: true,
        payments: [{ value: '100.50', dueDate: new Date() }],
        uploadedFiles: [],
      };

      jest.spyOn(prisma, '$transaction').mockImplementation(async () => {
        throw new BadRequestException(
          'Algo deu errado, confira os campos e tente novamente.',
        );
      });

      try {
        await sut.create(paymentRequestGeneralDto, []);
      } catch (error) {
        console.log(error);
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual(
          'Algo deu errado, confira os campos e tente novamente.',
        );
      }
    });
  });
});
