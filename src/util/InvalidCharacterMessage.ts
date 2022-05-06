export class InvalidCharacterError extends Error {
  constructor(message: string) {
    super(message);
  }

  get name() {
    return this.constructor.name;
  }
}
