type JSONResponse<T> = {
  data?: T,
  errors?: Array<{ message: string }>
};

/**
 * Parses raw `fetch` response into a typed JSON value.
 *
 * Corresponds to `parseRes` function:
 * https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js#L546
 *
 */
export async function parseResponse<T>(raw: Promise<Response>):Promise<T> {
  const response = await raw;
  const jsonResponse: JSONResponse<T> = await response.json();
  if (response.ok) {
    if (typeof jsonResponse.data !== 'undefined') {
      return jsonResponse.data;
    } else {
      return Promise.reject(new Error('Response omitted expected `data` field.'));
    }
  } else {
    // Concatenate and emit API errors
    if (typeof jsonResponse.errors !== 'undefined') {
      const errorMsg:string = jsonResponse.errors.map(e => e.message).join('\n');
      return Promise.reject(new Error(errorMsg));
    } else {
      return Promise.reject(new Error('Response omitted expected `errors` field.'));
    }
  }
}
