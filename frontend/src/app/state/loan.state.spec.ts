import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { provideStore, Store } from '@ngxs/store';
import { CreateLoanRequest, LoanResponse } from '../models/loan.model';
import { LoansApiService } from '../services/loans-api.service';
import { ClearLoanStatus, CreateLoan } from './loan.actions';
import { LoanState } from './loan.state';
import { createLoanResponse } from '../../test/test-factories';

describe('LoanState', () => {
  let store: Store;
  let api: { createLoan: jest.Mock };

  const payload: CreateLoanRequest = {
    userId: 1,
    bookIsbn: '123',
    expectedReturnDate: '2030-01-01T00:00:00Z'
  };

  const response: LoanResponse = createLoanResponse();

  beforeEach(() => {
    api = { createLoan: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideStore([LoanState]),
        { provide: LoansApiService, useValue: api }
      ]
    });

    store = TestBed.inject(Store);
  });

  it('creates loan successfully', async () => {
    api.createLoan.mockReturnValue(of(response));

    await store.dispatch(new CreateLoan(payload)).toPromise();

    const snapshot = store.selectSnapshot((state) => state.loan);
    expect(snapshot.creating).toBe(false);
    expect(snapshot.success).toBe(true);
    expect(snapshot.lastCreatedLoan).toEqual(response);
  });

  it('sets error when create fails', async () => {
    api.createLoan.mockReturnValue(throwError(() => new Error('Create failed')));

    await expect(store.dispatch(new CreateLoan(payload)).toPromise()).rejects.toThrow('Create failed');

    const snapshot = store.selectSnapshot((state) => state.loan);
    expect(snapshot.creating).toBe(false);
    expect(snapshot.success).toBe(false);
    expect(snapshot.error).toContain('Create failed');
  });

  it('clears status', async () => {
    api.createLoan.mockReturnValue(of(response));

    await store.dispatch(new CreateLoan(payload)).toPromise();
    await store.dispatch(new ClearLoanStatus()).toPromise();

    const snapshot = store.selectSnapshot((state) => state.loan);
    expect(snapshot.success).toBe(false);
    expect(snapshot.error).toBeNull();
  });

  it('uses backend nested error message when present', async () => {
    api.createLoan.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 409,
            error: { message: 'User already has an active loan for ISBN: 123' }
          })
      )
    );

    await expect(store.dispatch(new CreateLoan(payload)).toPromise()).rejects.toBeDefined();

    const snapshot = store.selectSnapshot((state) => state.loan);
    expect(snapshot.error).toBe('User already has an active loan for ISBN: 123');
  });
});
