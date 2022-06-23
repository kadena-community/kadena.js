export class InvalidCharacterError extends Error {
  get name() {
    return this.constructor.name;
  }
}
