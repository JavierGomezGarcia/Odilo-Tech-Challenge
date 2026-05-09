import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { provideStore, Store } from '@ngxs/store';
import { CreateLoanRequest, LoanResponse } from '../models/loan.model';
import { LoansApiService } from '../services/loans-api.service';
import { ClearLoanStatus, CreateLoan } from './loan.actions';
import { LoanState } from './loan.state';

describe('LoanState', () => {
  let store: Store;
  let api: jasmine.SpyObj<LoansApiService>;

  const payload: CreateLoanRequest = {
    userId: 1,
    bookIsbn: '123',
    expectedReturnDate: '2030-01-01T00:00:00Z'
  };

  const response: LoanResponse = {
    id: 99,
    userId: 1,
    bookIsbn: '123',
    expectedReturnDate: '2030-01-01T00:00:00Z',
    actualReturnDate: null,
    active: true,
    createdAt: '2026-01-01T00:00:00Z'
  };

  beforeEach(() => {
    api = jasmine.createSpyObj<LoansApiService>('LoansApiService', ['createLoan']);

    TestBed.configureTestingModule({
      providers: [
        provideStore([LoanState]),
        { provide: LoansApiService, useValue: api }
      ]
    });

    store = TestBed.inject(Store);
  });

  it('creates loan successfully', (done) => {
    api.createLoan.and.returnValue(of(response));

    store.dispatch(new CreateLoan(payload)).subscribe({
      next: () => {
        const snapshot = store.selectSnapshot((state) => state.loan);
        expect(snapshot.creating).toBeFalse();
        expect(snapshot.success).toBeTrue();
        expect(snapshot.lastCreatedLoan).toEqual(response);
        done();
      },
      error: done.fail
    });
  });

  it('sets error when create fails', (done) => {
    api.createLoan.and.returnValue(throwError(() => new Error('Create failed')));

    store.dispatch(new CreateLoan(payload)).subscribe({
      next: () => done.fail('expected error'),
      error: () => {
        const snapshot = store.selectSnapshot((state) => state.loan);
        expect(snapshot.creating).toBeFalse();
        expect(snapshot.success).toBeFalse();
        expect(snapshot.error).toContain('Create failed');
        done();
      }
    });
  });

  it('clears status', (done) => {
    api.createLoan.and.returnValue(of(response));

    store.dispatch(new CreateLoan(payload)).subscribe({
      next: () => {
        store.dispatch(new ClearLoanStatus()).subscribe({
          next: () => {
            const snapshot = store.selectSnapshot((state) => state.loan);
            expect(snapshot.success).toBeFalse();
            expect(snapshot.error).toBeNull();
            done();
          },
          error: done.fail
        });
      },
      error: done.fail
    });
  });
});
