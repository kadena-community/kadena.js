export class PactCommandError extends Error {
  public pactError: any;

  constructor(message: string, pactError?: any) {
    super(message);
    this.pactError = pactError;
  }
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type CommandData = {
  key: string;
  value: string;
};
