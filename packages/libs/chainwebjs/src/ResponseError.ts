/**
 * ResponseError
 *
 * @param response - Response object
 * @alpha
 */
export class ResponseError extends Error {
  public response: Response;
  public constructor(response: Response) {
    const msg = `Request ${response.url} failed with ${response.status}, ${response.statusText}`;
    super(msg);
    this.response = response;
  }
}
