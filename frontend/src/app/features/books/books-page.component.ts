import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Book } from '../../models/book.model';
import { SetPrefilledIsbn } from '../../state/loan-ui.actions';
import { LoadBooks } from '../../state/books.actions';
import { BooksState } from '../../state/books.state';

@Component({
  selector: 'app-books-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './books-page.component.html',
  styleUrl: './books-page.component.sass'
})
export class BooksPageComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  protected titleFilter = '';
  protected pageSize = 10;

  protected readonly books = this.store.selectSignal(BooksState.items);
  protected readonly loading = this.store.selectSignal(BooksState.loading);
  protected readonly error = this.store.selectSignal(BooksState.error);
  protected readonly page = this.store.selectSignal(BooksState.page);
  protected readonly totalElements = this.store.selectSignal(BooksState.totalElements);
  protected readonly totalPages = this.store.selectSignal(BooksState.totalPages);

  ngOnInit(): void {
    this.loadBooks(0);
  }

  protected onSearch(): void {
    this.loadBooks(0);
  }

  protected onPageSizeChange(): void {
    this.loadBooks(0);
  }

  protected previousPage(): void {
    if (this.page() <= 0) {
      return;
    }

    this.loadBooks(this.page() - 1);
  }

  protected nextPage(): void {
    if (this.page() >= this.totalPages() - 1) {
      return;
    }

    this.loadBooks(this.page() + 1);
  }

  protected goToLoan(book: Book): void {
    this.store.dispatch(new SetPrefilledIsbn(book.isbn));
    this.router.navigate(['/loans/new'], { queryParams: { isbn: book.isbn } });
  }

  private loadBooks(page: number): void {
    this.store.dispatch(new LoadBooks(this.titleFilter, page, this.pageSize));
  }
}
