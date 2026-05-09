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

  beforeEach(async () => {
    queryParamMap$ = new BehaviorSubject(convertToParamMap({ isbn: 'ISBN-001' }));

    const booksApi = jasmine.createSpyObj<BooksApiService>('BooksApiService', ['searchBooks']);
    booksApi.searchBooks.and.returnValue(of({
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 10,
      number: 0
    }));

    const loansApi = jasmine.createSpyObj<LoansApiService>('LoansApiService', ['createLoan']);
    loansApi.createLoan.and.returnValue(of({
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
});
