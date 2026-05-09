import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, tap, throwError } from 'rxjs';
import { LoanResponse } from '../models/loan.model';
import { LoansApiService } from '../services/loans-api.service';
import { CreateLoan, ClearLoanStatus } from './loan.actions';

export interface LoanStateModel {
  creating: boolean;
  success: boolean;
  error: string | null;
  lastCreatedLoan: LoanResponse | null;
}

@Injectable()
@State<LoanStateModel>({
  name: 'loan',
  defaults: {
    creating: false,
    success: false,
    error: null,
    lastCreatedLoan: null
  }
})
export class LoanState {
  private readonly loansApi = inject(LoansApiService);

  @Selector()
  static creating(state: LoanStateModel): boolean {
    return state.creating;
  }

  @Selector()
  static success(state: LoanStateModel): boolean {
    return state.success;
  }

  @Selector()
  static error(state: LoanStateModel): string | null {
    return state.error;
  }

  @Selector()
  static lastCreatedLoan(state: LoanStateModel): LoanResponse | null {
    return state.lastCreatedLoan;
  }

  @Action(CreateLoan)
  createLoan(ctx: StateContext<LoanStateModel>, action: CreateLoan) {
    ctx.patchState({ creating: true, success: false, error: null });

    return this.loansApi.createLoan(action.payload).pipe(
      tap((response) => {
        ctx.patchState({
          creating: false,
          success: true,
          error: null,
          lastCreatedLoan: response
        });
      }),
      catchError((error: unknown) => {
        ctx.patchState({ creating: false, success: false, error: this.toMessage(error) });
        return throwError(() => error);
      })
    );
  }

  @Action(ClearLoanStatus)
  clearLoanStatus(ctx: StateContext<LoanStateModel>) {
    ctx.patchState({ creating: false, success: false, error: null });
  }

  private toMessage(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return String((error as { message?: unknown }).message ?? 'Unexpected error');
    }

    return 'Unexpected error';
  }
}
