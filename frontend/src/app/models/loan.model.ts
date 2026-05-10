export interface CreateLoanRequest {
  userId: number;
  bookIsbn: string;
  expectedReturnDate: string;
}

export interface LoanResponse {
  id: number;
  userId: number;
  bookIsbn: string;
  expectedReturnDate: string;
  actualReturnDate: string | null;
  active: boolean;
  createdAt: string;
}
