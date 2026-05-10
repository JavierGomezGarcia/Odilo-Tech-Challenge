import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Book } from '../models/book.model';
import { PagedResponse } from '../models/paged-response.model';

@Injectable({ providedIn: 'root' })
export class BooksApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/books`;

  searchBooks(title: string | undefined, page: number, size: number): Observable<PagedResponse<Book>> {
    let params = new HttpParams();

    if (title?.trim()) {
      params = params.set('title', title.trim());
    }

    params = params.set('page', page).set('size', size);

    return this.http.get<PagedResponse<Book>>(this.baseUrl, { params });
  }
}
