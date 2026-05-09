import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BooksApiService } from './books-api.service';
import { environment } from '../../environments/environment';

describe('BooksApiService', () => {
  let service: BooksApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), BooksApiService]
    });

    service = TestBed.inject(BooksApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('sends title, page and size params', () => {
    service.searchBooks('Clean Code', 2, 20).subscribe();

    const req = httpMock.expectOne(
      `${environment.apiBaseUrl}/books?title=Clean%20Code&page=2&size=20`
    );
    expect(req.request.method).toBe('GET');
    req.flush({ content: [], totalElements: 0, totalPages: 0, size: 20, number: 2 });
  });
});
