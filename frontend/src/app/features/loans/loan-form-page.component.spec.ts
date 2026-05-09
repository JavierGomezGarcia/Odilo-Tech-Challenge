import { convertToParamMap } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject, of } from 'rxjs';
import { provideStore } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { BooksApiService } from '../../services/books-api.service';
import { LoansApiService } from '../../services/loans-api.service';
import { BooksState } from '../../state/books.state';
import { LoanState } from '../../state/loan.state';
import { LoanUiState } from '../../state/loan-ui.state';
import { LoanFormPageComponent } from './loan-form-page.component';

describe('LoanFormPageComponent', () => {
  let fixture: ComponentFixture<LoanFormPageComponent>;
  let queryParamMap$: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  let loansApi: { createLoan: jest.Mock };

  beforeEach(async () => {
    queryParamMap$ = new BehaviorSubject(convertToParamMap({ isbn: 'ISBN-001' }));

    const booksApi = { searchBooks: jest.fn() };
    booksApi.searchBooks.mockReturnValue(of({
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 10,
      number: 0
    }));

    loansApi = { createLoan: jest.fn() };
    loansApi.createLoan.mockReturnValue(of({
      id: 1,
      userId: 1,
      bookIsbn: 'ISBN-001',
      expectedReturnDate: '2030-01-01T00:00:00Z',
      actualReturnDate: null,
      active: true,
      createdAt: '2026-01-01T00:00:00Z'
    }));

    await TestBed.configureTestingModule({
      imports: [LoanFormPageComponent],
      providers: [
        provideStore([BooksState, LoanState, LoanUiState]),
        { provide: BooksApiService, useValue: booksApi },
        { provide: LoansApiService, useValue: loansApi },
        { provide: ActivatedRoute, useValue: { queryParamMap: queryParamMap$.asObservable() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoanFormPageComponent);
    fixture.detectChanges();
  });

  it('prefills isbn from query param', () => {
    const component = fixture.componentInstance;
    expect(component['form'].controls.bookIsbn.value).toBe('ISBN-001');
  });

  it('allows changing isbn manually', () => {
    const component = fixture.componentInstance;
    const control = component['form'].controls.bookIsbn;

    control.setValue('CUSTOM-ISBN');
    control.markAsDirty();

    queryParamMap$.next(convertToParamMap({ isbn: 'ISBN-002' }));
    fixture.detectChanges();

    expect(control.value).toBe('CUSTOM-ISBN');
  });

  it('shows required validation message', () => {
    const component = fixture.componentInstance;
    const control = component['form'].controls.userId;
    control.markAsTouched();
    control.setValue(null);
    expect(component['controlError']('userId')).toBe('This field is required.');
  });

  it('shows future-date validation message for past dates', () => {
    const component = fixture.componentInstance;
    const control = component['form'].controls.expectedReturnDate;
    control.setValue('2000-01-01T10:00');
    control.markAsTouched();
    expect(component['controlError']('expectedReturnDate')).toBe('Expected return date must be in the future.');
  });

  it('submits a valid loan form', async () => {
    const component = fixture.componentInstance;
    component['form'].controls.userId.setValue(1);
    component['form'].controls.bookIsbn.setValue('ISBN-001');
    component['form'].controls.expectedReturnDate.setValue('2030-01-01T10:00');

    await component['submit']();

    expect(loansApi.createLoan).toHaveBeenCalled();
  });
});
