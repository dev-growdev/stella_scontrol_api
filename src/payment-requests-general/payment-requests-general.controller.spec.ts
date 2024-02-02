import { Test, TestingModule } from '@nestjs/testing';
import { PaymentRequestsController } from './payment-requests-general.controller';
import { PaymentRequestsService } from './payment-requests-general.service';
import { PaymentRequestGeneralDTO } from './dto';
import { InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

const makePaymentRequestGeneralDTO = (): PaymentRequestGeneralDTO => {
  return {
    description: 'any_description',
    sendReceipt: true,
    totalRequestValue: '100.50',
    dueDate: new Date(),
  };
};

describe('PaymentRequestsController', () => {
  let controller: PaymentRequestsController;
  let service: PaymentRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentRequestsController],
      providers: [PaymentRequestsService, PrismaService, ConfigService],
    }).compile();

    controller = module.get<PaymentRequestsController>(
      PaymentRequestsController,
    );
    service = module.get<PaymentRequestsService>(PaymentRequestsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create - POST', () => {
    it('should create a payment request general and return the created data on success', async () => {
      const paymentRequestDTO = makePaymentRequestGeneralDTO();

      jest.spyOn(service, 'create').mockImplementation(async () => {
        return Promise.resolve({
          uid: '1',
          description: 'Solicito pagamento para um equipamento novo.',
          sendReceipt: true,
          totalRequestValue: 100.5,
          duoDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      const result = await controller.create(paymentRequestDTO);

      expect(result).toBeDefined();
      expect(result.uid).toEqual('1');
    });

    it('should handle errors and return InternalServerErrorException on failure', async () => {
      const paymentRequestDTO = makePaymentRequestGeneralDTO();

      jest.spyOn(service, 'create').mockImplementation(async () => {
        throw new InternalServerErrorException('Test error');
      });

      try {
        await controller.create(paymentRequestDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(InternalServerErrorException);
        expect(error.message).toEqual('Test error');
      }
    });
  });
});
