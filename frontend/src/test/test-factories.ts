import { Book } from '../app/models/book.model';
import { LoanResponse } from '../app/models/loan.model';
import { PagedResponse } from '../app/models/paged-response.model';

export function createBook(overrides: Partial<Book> = {}): Book {
  return {
    isbn: '123',
    title: 'Demo Book',
    totalCopies: 3,
    availableCopies: 2,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    ...overrides
  };
}

export function createBooksPage(books: Book[] = [createBook()]): PagedResponse<Book> {
  return {
    content: books,
    totalElements: books.length,
    totalPages: 1,
    size: 10,
    number: 0
  };
}

export function createLoanResponse(overrides: Partial<LoanResponse> = {}): LoanResponse {
  return {
    id: 99,
    userId: 1,
    bookIsbn: '123',
    expectedReturnDate: '2030-01-01T00:00:00Z',
    actualReturnDate: null,
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
    ...overrides
  };
}
