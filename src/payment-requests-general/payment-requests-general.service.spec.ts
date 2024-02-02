import { Test, TestingModule } from '@nestjs/testing';
import { PaymentRequestsService } from './payment-requests-general.service';
import { PaymentRequestGeneralDTO } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { InternalServerErrorException } from '@nestjs/common';

const makePaymentRequestGeneralDTO = (): PaymentRequestGeneralDTO => {
  return {
    description: 'Solicito pagamento para um equipamento novo.',
    sendReceipt: true,
    totalRequestValue: '100.50',
    dueDate: new Date(),
  };
};

describe('PaymentRequestsService', () => {
  let service: PaymentRequestsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentRequestsService,
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentRequestsService>(PaymentRequestsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create - POST', () => {
    it('should create a payment request general and return the created data on success', async () => {
      const paymentRequestDTO = makePaymentRequestGeneralDTO();

      jest.spyOn(prismaService, '$transaction').mockImplementation(async () => {
        const createdPaymentRequest = {
          description: paymentRequestDTO.description,
          sendReceipt: paymentRequestDTO.sendReceipt,
          totalRequestValue: parseFloat(paymentRequestDTO.totalRequestValue),
          duoDate: paymentRequestDTO.dueDate,
        };

        return createdPaymentRequest;
      });

      const createdPaymentRequest = await service.create(paymentRequestDTO);

      expect(createdPaymentRequest).toBeDefined();
    });

    it('should handle errors and throw InternalServerErrorException on failure', async () => {
      const paymentRequestDTO = makePaymentRequestGeneralDTO();

      jest.spyOn(prismaService, '$transaction').mockImplementation(async () => {
        throw new Error('Test error');
      });

      try {
        await service.create(paymentRequestDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Test error');
      }
    });
  });
});
