import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { LoansApiService } from './loans-api.service';
import { environment } from '../../environments/environment';
import { CreateLoanRequest } from '../models/loan.model';

describe('LoansApiService', () => {
  let service: LoansApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), LoansApiService]
    });

    service = TestBed.inject(LoansApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('posts loan payload', () => {
    const payload: CreateLoanRequest = {
      userId: 1,
      bookIsbn: '9780132350884',
      expectedReturnDate: '2030-01-01T00:00:00.000Z'
    };

    service.createLoan(payload).subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/loans`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({
      id: 1,
      userId: 1,
      bookIsbn: '9780132350884',
      expectedReturnDate: '2030-01-01T00:00:00.000Z',
      actualReturnDate: null,
      active: true,
      createdAt: '2026-01-01T00:00:00Z'
    });
  });
});
