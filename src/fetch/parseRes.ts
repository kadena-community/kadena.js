type JSONResponse<T> = {
  data?: T,
  errors?: Array<{message: string}>
}

/**
 * Parses raw `fetch` response into a typed JSON value.
 *
 * Corresponds to `parseRes` function:
 * https://github.com/kadena-io/pact-lang-api/blob/master/pact-lang-api.js#L546
 *
 */
export async function parseRes<T>(raw: Promise<Response>):Promise<T> {
  const res = await raw;
  const {data, errors}: JSONResponse<T> = await res.json()
  if (res.ok) {
    if (typeof data !== 'undefined') {
      return data;
    } else {
      return Promise.reject(new Error('Response omitted expected `data` field.'));
    };
  } else {
    // Concatenate and emit API errors
    if (typeof errors !== 'undefined') {
        const errorMsg = errors.map(e => e.message).join('\n');
        return Promise.reject(new Error (errorMsg));
    } else {
        return Promise.reject(new Error('Response omitted expected `errors` field.'));
    };
  };
};
