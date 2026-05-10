import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngxs/store';
import { SetPrefilledIsbn } from './loan-ui.actions';
import { LoanUiState } from './loan-ui.state';

describe('LoanUiState', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideStore([LoanUiState])]
    });

    store = TestBed.inject(Store);
  });

  it('sets prefilled isbn', async () => {
    await store.dispatch(new SetPrefilledIsbn('9780132350884')).toPromise();
    const snapshot = store.selectSnapshot((state) => state.loanUi);
    expect(snapshot.prefilledIsbn).toBe('9780132350884');
  });
});
