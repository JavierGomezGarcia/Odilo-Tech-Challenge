export class SetPrefilledIsbn {
  static readonly type = '[Loan UI] Set Prefilled Isbn';

  constructor(public readonly isbn: string | null) {}
}
