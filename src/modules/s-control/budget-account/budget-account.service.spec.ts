import { Test, TestingModule } from '@nestjs/testing';
import { BudgetAccountService } from './budget-account.service';
import { FacadesModule } from '@/modules/@facades/facades.module';

describe('BudgetAccountService', () => {
  let service: BudgetAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [FacadesModule],
      providers: [BudgetAccountService],
    }).compile();

    service = module.get<BudgetAccountService>(BudgetAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
