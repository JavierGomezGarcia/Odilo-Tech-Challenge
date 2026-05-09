import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateLoanRequest, LoanResponse } from '../models/loan.model';

@Injectable({ providedIn: 'root' })
export class LoansApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/loans`;

  createLoan(payload: CreateLoanRequest): Observable<LoanResponse> {
    return this.http.post<LoanResponse>(this.baseUrl, payload);
  }
}
