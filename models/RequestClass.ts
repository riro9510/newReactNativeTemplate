
export abstract class Request<T> {
  constructor(protected endpoint: string, protected data?: unknown) {}

  abstract send(): Promise<T>;

  protected async handleRequest(fetchFunction: () => Promise<T>): Promise<T> {
    try {
      return await fetchFunction();
    } catch (error) {
      console.error(`Error in request to ${this.endpoint}:`, error);
      throw error;
    }
  }
}
