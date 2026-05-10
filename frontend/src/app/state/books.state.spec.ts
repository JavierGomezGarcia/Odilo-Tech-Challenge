import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { provideStore, Store } from '@ngxs/store';
import { Book } from '../models/book.model';
import { PagedResponse } from '../models/paged-response.model';
import { BooksApiService } from '../services/books-api.service';
import { LoadBooks } from './books.actions';
import { BooksState } from './books.state';
import { createBook, createBooksPage } from '../../test/test-factories';

describe('BooksState', () => {
  let store: Store;
  let api: { searchBooks: jest.Mock };

  const mockBooks: Book[] = [createBook()];

  const mockPage: PagedResponse<Book> = createBooksPage(mockBooks);

  beforeEach(() => {
    api = { searchBooks: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideStore([BooksState]),
        { provide: BooksApiService, useValue: api }
      ]
    });

    store = TestBed.inject(Store);
  });

  it('loads books successfully', async () => {
    api.searchBooks.mockReturnValue(of(mockPage));

    await store.dispatch(new LoadBooks()).toPromise();

    const snapshot = store.selectSnapshot((state) => state.books);
    expect(snapshot.items).toEqual(mockBooks);
    expect(snapshot.totalElements).toBe(1);
    expect(snapshot.totalPages).toBe(1);
    expect(snapshot.loading).toBe(false);
    expect(snapshot.error).toBeNull();
  });

  it('sets error on load failure', async () => {
    api.searchBooks.mockReturnValue(throwError(() => new Error('Load failed')));

    await expect(store.dispatch(new LoadBooks()).toPromise()).rejects.toThrow('Load failed');

    const snapshot = store.selectSnapshot((state) => state.books);
    expect(snapshot.loading).toBe(false);
    expect(snapshot.error).toContain('Load failed');
  });

  it('uses nested backend error message', async () => {
    api.searchBooks.mockReturnValue(
      throwError(
        () =>
          new HttpErrorResponse({
            status: 400,
            error: { message: 'Invalid title filter' }
          })
      )
    );

    await expect(store.dispatch(new LoadBooks()).toPromise()).rejects.toBeDefined();

    const snapshot = store.selectSnapshot((state) => state.books);
    expect(snapshot.error).toBe('Invalid title filter');
  });
});
