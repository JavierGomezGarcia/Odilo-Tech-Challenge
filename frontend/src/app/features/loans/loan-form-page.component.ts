import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, effect, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { firstValueFrom, Subscription } from 'rxjs';
import { CreateLoanRequest } from '../../models/loan.model';
import { SetPrefilledIsbn } from '../../state/loan-ui.actions';
import { ClearLoanStatus, CreateLoan } from '../../state/loan.actions';
import { LoadBooks } from '../../state/books.actions';
import { LoanState } from '../../state/loan.state';
import { LoanUiState } from '../../state/loan-ui.state';

@Component({
  selector: 'app-loan-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './loan-form-page.component.html',
  styleUrl: './loan-form-page.component.sass'
})
export class LoanFormPageComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);

  private readonly querySub = new Subscription();

  protected readonly creating = this.store.selectSignal(LoanState.creating);
  protected readonly success = this.store.selectSignal(LoanState.success);
  protected readonly error = this.store.selectSignal(LoanState.error);
  protected readonly lastCreated = this.store.selectSignal(LoanState.lastCreatedLoan);
  protected readonly prefilledIsbn = this.store.selectSignal(LoanUiState.prefilledIsbn);

  protected readonly form = this.fb.group({
    userId: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
    bookIsbn: this.fb.control<string>('', [Validators.required]),
    expectedReturnDate: this.fb.control<string>('', [Validators.required, this.futureDateValidator])
  });

  constructor() {
    effect(() => {
      const isbn = this.prefilledIsbn();
      const control = this.form.controls.bookIsbn;

      if (isbn && !control.dirty && !control.value) {
        control.setValue(isbn);
      }
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new ClearLoanStatus());

    this.querySub.add(
      this.route.queryParamMap.subscribe((params) => {
        const isbn = params.get('isbn');

        if (isbn) {
          this.store.dispatch(new SetPrefilledIsbn(isbn));

          const control = this.form.controls.bookIsbn;
          if (!control.dirty) {
            control.setValue(isbn);
          }
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.querySub.unsubscribe();
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid || this.creating()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: CreateLoanRequest = {
      userId: Number(value.userId),
      bookIsbn: String(value.bookIsbn).trim(),
      expectedReturnDate: new Date(String(value.expectedReturnDate)).toISOString()
    };

    try {
      await firstValueFrom(this.store.dispatch(new CreateLoan(payload)));
      await firstValueFrom(this.store.dispatch(new LoadBooks()));
    } catch {
      // Error state is handled in NGXS
    }
  }

  protected controlError(controlName: 'userId' | 'bookIsbn' | 'expectedReturnDate'): string | null {
    const control = this.form.controls[controlName];

    if (!control.touched) {
      return null;
    }

    if (control.hasError('required')) {
      return 'This field is required.';
    }

    if (controlName === 'userId' && control.hasError('min')) {
      return 'User ID must be greater than 0.';
    }

    if (controlName === 'expectedReturnDate' && control.hasError('futureDate')) {
      return 'Expected return date must be in the future.';
    }

    return null;
  }

  private futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const selected = new Date(control.value).getTime();

    if (Number.isNaN(selected)) {
      return { futureDate: true };
    }

    return selected > Date.now() ? null : { futureDate: true };
  }
}
