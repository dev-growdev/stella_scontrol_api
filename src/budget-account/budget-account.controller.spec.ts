import { Test, TestingModule } from '@nestjs/testing';
import { BudgetAccountController } from './budget-account.controller';
import { BudgetAccountService } from './budget-account.service';

describe('BudgetAccountController', () => {
  let controller: BudgetAccountController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetAccountController],
      providers: [BudgetAccountService],
    }).compile();

    controller = module.get<BudgetAccountController>(BudgetAccountController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
