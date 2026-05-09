export class LoadBooks {
  static readonly type = '[Books] Load';

  constructor(
    public readonly title?: string,
    public readonly page: number = 0,
    public readonly size: number = 10
  ) {}
}
