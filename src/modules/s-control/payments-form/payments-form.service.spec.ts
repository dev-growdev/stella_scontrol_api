import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsFormService } from './payments-form.service';

describe('PaymentsFormService', () => {
  let service: PaymentsFormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsFormService],
    }).compile();

    service = module.get<PaymentsFormService>(PaymentsFormService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
