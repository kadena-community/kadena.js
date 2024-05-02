export class PactCommandError extends Error {
  public pactError:
    | {
        message: string;
        type: string;
      }
    | undefined;

  public constructor(
    message: string,
    pactError?: {
      message: string;
      type: string;
    },
  ) {
    super(message);
    this.pactError = pactError;
  }
}

export interface ICommandData {
  key: string;
  value: string;
}
