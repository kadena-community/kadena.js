export class InvalidCharacterError extends Error {
  public get name(): string {
    return this.constructor.name;
  }
}
