import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { SetPrefilledIsbn } from './loan-ui.actions';

export interface LoanUiStateModel {
  prefilledIsbn: string | null;
}

@Injectable()
@State<LoanUiStateModel>({
  name: 'loanUi',
  defaults: {
    prefilledIsbn: null
  }
})
export class LoanUiState {
  @Selector()
  static prefilledIsbn(state: LoanUiStateModel): string | null {
    return state.prefilledIsbn;
  }

  @Action(SetPrefilledIsbn)
  setPrefilledIsbn(ctx: StateContext<LoanUiStateModel>, action: SetPrefilledIsbn) {
    ctx.patchState({ prefilledIsbn: action.isbn });
  }
}
