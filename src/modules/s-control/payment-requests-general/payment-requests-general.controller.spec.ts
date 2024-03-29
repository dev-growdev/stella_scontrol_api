import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../shared/modules/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { PaymentRequestsGeneralService } from './payment-requests-general.service';
import { PaymentRequestsGeneralController } from './payment-requests-general.controller';
import { CreatePaymentRequestGeneralDto } from './dto/payment-requests-general-input.dto';

const makePaymentRequestGeneralDto = (): CreatePaymentRequestGeneralDto => {
  return {
    description: 'Solicito pagamento para um equipamento novo.',
    supplier: '1234567891011',
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
    service = module.get<PaymentRequestsGeneralService>(
      PaymentRequestsGeneralService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create - POST', () => {
    it('should create a payment request general and return the created data on success', async () => {
      const paymentRequestGeneralDto = makePaymentRequestGeneralDto();

      jest.spyOn(service, 'create').mockImplementation(async () => {
        return Promise.resolve({
          uid: '1',
          description: 'Solicito pagamento para um equipamento novo.',
          supplier: '1234567891011',
          sendReceipt: true,
          totalRequestValue: 100.5,
          dueDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const result = await controller.create(paymentRequestGeneralDto);

      expect(result).toBeDefined();
      expect(result.uid).toEqual('1');
    });

    it('should handle errors and return InternalServerErrorException on failure', async () => {
      const paymentRequestGeneralDto = makePaymentRequestGeneralDto();

      jest.spyOn(service, 'create').mockImplementation(async () => {
        throw new InternalServerErrorException('Test error');
      });

      try {
        await controller.create(paymentRequestGeneralDto);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Test error');
      }
    });
  });
});
