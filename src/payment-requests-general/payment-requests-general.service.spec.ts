import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';
import { PaymentRequestsGeneralService } from './payment-requests-general.service';
import { PaymentRequestGeneralDTO } from './dto';

const makePaymentRequestGeneralDTO = (): PaymentRequestGeneralDTO => {
  return {
    description: 'Solicito pagamento para um equipamento novo.',
    sendReceipt: true,
    totalRequestValue: '100.50',
    dueDate: new Date(),
  };
};

describe('PaymentRequestsGeneralService', () => {
  let service: PaymentRequestsGeneralService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentRequestsGeneralService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentRequestsGeneralService>(PaymentRequestsGeneralService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create - POST', () => {
    it('should create a payment request general and return the created data on success', async () => {
      const paymentRequestGeneralDTO = makePaymentRequestGeneralDTO();

      jest.spyOn(prismaService, '$transaction').mockImplementation(async () => {
        const createdPaymentRequestGeneral = {
          description: paymentRequestGeneralDTO.description,
          sendReceipt: paymentRequestGeneralDTO.sendReceipt,
          totalRequestValue: parseFloat(paymentRequestGeneralDTO.totalRequestValue),
          dueDate: paymentRequestGeneralDTO.dueDate,
        };

        return createdPaymentRequestGeneral;
      });

      const createdPaymentRequestGeneral = await service.create(paymentRequestGeneralDTO);

      expect(createdPaymentRequestGeneral).toBeDefined();
    });

    it('should handle errors and throw InternalServerErrorException on failure', async () => {
      const paymentRequestGeneralDTO = makePaymentRequestGeneralDTO();

      jest.spyOn(prismaService, '$transaction').mockImplementation(async () => {
        throw new Error('Test error');
      });

      try {
        await service.create(paymentRequestGeneralDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Test error');
      }
    });
  });
});
