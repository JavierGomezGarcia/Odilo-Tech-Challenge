import { CreateLoanRequest } from '../models/loan.model';

export class CreateLoan {
  static readonly type = '[Loan] Create';

  constructor(public readonly payload: CreateLoanRequest) {}
}

export class ClearLoanStatus {
  static readonly type = '[Loan] Clear Status';
}
