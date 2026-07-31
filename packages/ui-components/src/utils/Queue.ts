export class Queue {
  private lastJob?: Promise<unknown>;

  push<T>(job: () => Promise<T>): Promise<T> {
    const work = async () => {
      if (this.lastJob) {
        await this.lastJob;
      }
      return job();
    };
    const result = work();
    this.lastJob = result;
    return result;
  }
}
