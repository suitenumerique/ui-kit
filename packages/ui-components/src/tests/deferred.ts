/*
 * Test helper: use a deferred object to control promise resolution without mocking
 * deep inside our code.
 */
export class Deferred<T> {
  promise: Promise<T>;
  reject!: (reason?: unknown) => void;
  resolve!: (value: T | PromiseLike<T>) => void;

  constructor() {
    this.promise = this._init();
  }

  reset() {
    this.promise = this._init();
  }

  private _init(): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}
