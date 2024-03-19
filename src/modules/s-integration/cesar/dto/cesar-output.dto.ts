export class CostCenterDto {
  id: number;
  name: string;
}

export class AccountingAccountsByCostCenterDto extends CostCenterDto {}

export class CheckAccountBalanceForOperationDto {
  totalBudget: number;
}
