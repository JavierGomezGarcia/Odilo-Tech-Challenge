import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { BooksPageComponent } from './books-page.component';
import { LoadBooks } from '../../state/books.actions';
import { SetPrefilledIsbn } from '../../state/loan-ui.actions';
import { createBook } from '../../../test/test-factories';

describe('BooksPageComponent', () => {
  let fixture: ComponentFixture<BooksPageComponent>;
  let component: BooksPageComponent;

  const dispatch = jest.fn(() => signal(null)() as unknown);
  const navigate = jest.fn();

  const storeMock = {
    dispatch,
    selectSignal: jest.fn(() => signal([]))
  };

  beforeEach(async () => {
    dispatch.mockClear();
    navigate.mockClear();

    storeMock.selectSignal
      .mockReturnValueOnce(signal([]))
      .mockReturnValueOnce(signal(false))
      .mockReturnValueOnce(signal(null))
      .mockReturnValueOnce(signal(0))
      .mockReturnValueOnce(signal(0))
      .mockReturnValueOnce(signal(0));

    await TestBed.configureTestingModule({
      imports: [BooksPageComponent],
      providers: [
        { provide: Store, useValue: storeMock },
        { provide: Router, useValue: { navigate } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BooksPageComponent);
    component = fixture.componentInstance;
  });

  it('loads books on init with first page', () => {
    component.ngOnInit();
    expect(dispatch).toHaveBeenCalledWith(new LoadBooks('', 0, 10));
  });

  it('dispatches search with current title and resets page', () => {
    (component as any).titleFilter = 'Clean';
    (component as any).onSearch();
    expect(dispatch).toHaveBeenCalledWith(new LoadBooks('Clean', 0, 10));
  });

  it('loads previous page when current page is greater than 0', () => {
    (component as any).page = signal(2);
    (component as any).previousPage();
    expect(dispatch).toHaveBeenCalledWith(new LoadBooks('', 1, 10));
  });

  it('does not load previous page when current page is 0', () => {
    dispatch.mockClear();
    (component as any).page = signal(0);
    (component as any).previousPage();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('loads next page when there are more pages', () => {
    (component as any).page = signal(0);
    (component as any).totalPages = signal(3);
    (component as any).nextPage();
    expect(dispatch).toHaveBeenCalledWith(new LoadBooks('', 1, 10));
  });

  it('does not load next page on last page', () => {
    dispatch.mockClear();
    (component as any).page = signal(2);
    (component as any).totalPages = signal(3);
    (component as any).nextPage();
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('navigates to loan page and sets prefilled isbn', () => {
    const book = createBook({ isbn: '9780132350884' });
    (component as any).goToLoan(book);

    expect(dispatch).toHaveBeenCalledWith(new SetPrefilledIsbn('9780132350884'));
    expect(navigate).toHaveBeenCalledWith(['/loans/new'], {
      queryParams: { isbn: '9780132350884' }
    });
  });
});
