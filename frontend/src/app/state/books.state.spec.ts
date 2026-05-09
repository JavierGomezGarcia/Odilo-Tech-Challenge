import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { provideStore, Store } from '@ngxs/store';
import { Book } from '../models/book.model';
import { PagedResponse } from '../models/paged-response.model';
import { BooksApiService } from '../services/books-api.service';
import { LoadBooks } from './books.actions';
import { BooksState } from './books.state';

describe('BooksState', () => {
  let store: Store;
  let api: jasmine.SpyObj<BooksApiService>;

  const mockBooks: Book[] = [
    {
      isbn: '123',
      title: 'Demo Book',
      totalCopies: 3,
      availableCopies: 2,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    }
  ];

  const mockPage: PagedResponse<Book> = {
    content: mockBooks,
    totalElements: 1,
    totalPages: 1,
    size: 10,
    number: 0
  };

  beforeEach(() => {
    api = jasmine.createSpyObj<BooksApiService>('BooksApiService', ['searchBooks']);

    TestBed.configureTestingModule({
      providers: [
        provideStore([BooksState]),
        { provide: BooksApiService, useValue: api }
      ]
    });

    store = TestBed.inject(Store);
  });

  it('loads books successfully', (done) => {
    api.searchBooks.and.returnValue(of(mockPage));

    store.dispatch(new LoadBooks()).subscribe({
      next: () => {
        const snapshot = store.selectSnapshot((state) => state.books);
        expect(snapshot.items).toEqual(mockBooks);
        expect(snapshot.totalElements).toBe(1);
        expect(snapshot.totalPages).toBe(1);
        expect(snapshot.loading).toBeFalse();
        expect(snapshot.error).toBeNull();
        done();
      },
      error: done.fail
    });
  });

  it('sets error on load failure', (done) => {
    api.searchBooks.and.returnValue(throwError(() => new Error('Load failed')));

    store.dispatch(new LoadBooks()).subscribe({
      next: () => done.fail('expected error'),
      error: () => {
        const snapshot = store.selectSnapshot((state) => state.books);
        expect(snapshot.loading).toBeFalse();
        expect(snapshot.error).toContain('Load failed');
        done();
      }
    });
  });
});
