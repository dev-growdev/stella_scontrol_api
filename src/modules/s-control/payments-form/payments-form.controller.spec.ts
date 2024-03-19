import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsFormController } from './payments-form.controller';
import { PaymentsFormService } from './payments-form.service';

describe('PaymentsFormController', () => {
  let controller: PaymentsFormController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsFormController],
      providers: [PaymentsFormService],
    }).compile();

    controller = module.get<PaymentsFormController>(PaymentsFormController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
