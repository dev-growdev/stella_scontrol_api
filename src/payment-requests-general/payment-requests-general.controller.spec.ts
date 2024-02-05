import { Test, TestingModule } from '@nestjs/testing';
import { PaymentRequestGeneralDTO } from './dto';
import { InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { PaymentRequestsGeneralService } from './payment-requests-general.service';
import { PaymentRequestsGeneralController } from './payment-requests-general.controller';

const makePaymentRequestGeneralDTO = (): PaymentRequestGeneralDTO => {
  return {
    description: 'Solicito pagamento para um equipamento novo.',
    sendReceipt: true,
    totalRequestValue: '100.50',
    dueDate: new Date(),
  };
};

describe('PaymentRequestsGeneralController', () => {
  let controller: PaymentRequestsGeneralController;
  let service: PaymentRequestsGeneralService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentRequestsGeneralController],
      providers: [PaymentRequestsGeneralService, PrismaService, ConfigService],
    }).compile();

    controller = module.get<PaymentRequestsGeneralController>(
      PaymentRequestsGeneralController,
    );
    service = module.get<PaymentRequestsGeneralService>(PaymentRequestsGeneralService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create - POST', () => {
    it('should create a payment request general and return the created data on success', async () => {
      const paymentRequestGeneralDTO = makePaymentRequestGeneralDTO();

      jest.spyOn(service, 'create').mockImplementation(async () => {
        return Promise.resolve({
          uid: '1',
          description: 'Solicito pagamento para um equipamento novo.',
          sendReceipt: true,
          totalRequestValue: 100.5,
          dueDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const result = await controller.create(paymentRequestGeneralDTO);

      expect(result).toBeDefined();
      expect(result.uid).toEqual('1');
    });

    it('should handle errors and return InternalServerErrorException on failure', async () => {
      const paymentRequestGeneralDTO = makePaymentRequestGeneralDTO();

      jest.spyOn(service, 'create').mockImplementation(async () => {
        throw new InternalServerErrorException('Test error');
      });

      try {
        await controller.create(paymentRequestGeneralDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Test error');
      }
    });
  });
});
