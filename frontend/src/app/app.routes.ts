import { Routes } from '@angular/router';
import { BooksPageComponent } from './features/books/books-page.component';
import { LoanFormPageComponent } from './features/loans/loan-form-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'books' },
  { path: 'books', component: BooksPageComponent },
  { path: 'loans/new', component: LoanFormPageComponent },
  { path: '**', redirectTo: 'books' }
];
