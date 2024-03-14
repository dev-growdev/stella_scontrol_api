import { Test, TestingModule } from '@nestjs/testing';
import { BudgetAccountService } from './budget-account.service';

describe('BudgetAccountService', () => {
  let service: BudgetAccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BudgetAccountService],
    }).compile();

    service = module.get<BudgetAccountService>(BudgetAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
