import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, tap, throwError } from 'rxjs';
import { Book } from '../models/book.model';
import { BooksApiService } from '../services/books-api.service';
import { LoadBooks } from './books.actions';

export interface BooksStateModel {
  items: Book[];
  loading: boolean;
  error: string | null;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  title: string;
}

@Injectable()
@State<BooksStateModel>({
  name: 'books',
  defaults: {
    items: [],
    loading: false,
    error: null,
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    title: ''
  }
})
export class BooksState {
  private readonly booksApi = inject(BooksApiService);

  @Selector()
  static items(state: BooksStateModel): Book[] {
    return state.items;
  }

  @Selector()
  static loading(state: BooksStateModel): boolean {
    return state.loading;
  }

  @Selector()
  static error(state: BooksStateModel): string | null {
    return state.error;
  }

  @Selector()
  static page(state: BooksStateModel): number {
    return state.page;
  }

  @Selector()
  static size(state: BooksStateModel): number {
    return state.size;
  }

  @Selector()
  static totalElements(state: BooksStateModel): number {
    return state.totalElements;
  }

  @Selector()
  static totalPages(state: BooksStateModel): number {
    return state.totalPages;
  }

  @Selector()
  static title(state: BooksStateModel): string {
    return state.title;
  }

  @Action(LoadBooks)
  loadBooks(ctx: StateContext<BooksStateModel>, action: LoadBooks) {
    ctx.patchState({ loading: true, error: null });

    return this.booksApi.searchBooks(action.title, action.page, action.size).pipe(
      tap((response) => {
        ctx.patchState({
          items: response.content,
          loading: false,
          error: null,
          page: response.number,
          size: response.size,
          totalElements: response.totalElements,
          totalPages: response.totalPages,
          title: action.title?.trim() ?? ''
        });
      }),
      catchError((error: unknown) => {
        ctx.patchState({ loading: false, error: this.toMessage(error) });
        return throwError(() => error);
      })
    );
  }

  private toMessage(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return String((error as { message?: unknown }).message ?? 'Unexpected error');
    }

    return 'Unexpected error';
  }
}
