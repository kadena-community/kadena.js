/**
 * crypto.randomUUID is the standard way to create uuid v4 and it is much faster than the uuid package, and it is well supported on all major browsers
 * NOTE: it only works on secure connection (https), don't worry it also works on localhost
 */
export function nanoid(t = 21) {
  return crypto.getRandomValues(new Uint8Array(t)).reduce(
    (t, e) =>
      (t +=
        // eslint-disable-next-line no-bitwise
        (e &= 63) < 36
          ? e.toString(36)
          : e < 62
            ? (e - 26).toString(36).toUpperCase()
            : e > 62
              ? '-'
              : '_'),
    '',
  );
}

function fallbackWhenNoCrypto() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getUuid() {
  if (typeof crypto === 'undefined') {
    return fallbackWhenNoCrypto();
  }
  // use nanoid instead of native crypto.randomUUID, mainly for nodejs/jest and also old browsers
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : nanoid(21);
}
