import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngxs/store';
import { routes } from './app.routes';
import { BooksState } from './state/books.state';
import { LoanState } from './state/loan.state';
import { LoanUiState } from './state/loan-ui.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore([BooksState, LoanState, LoanUiState])
  ]
};
