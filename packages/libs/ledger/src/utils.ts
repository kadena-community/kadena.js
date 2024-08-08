export function concatUint8Array(...buffers: ArrayBuffer[]): Uint8Array {
  const totalLength = buffers.reduce(
    (sum, buffer) => sum + buffer.byteLength,
    0,
  );
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const buffer of buffers) {
    result.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  }

  return result;
}

export function arrayBufferToHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('');
}

export function convertDecimal(decimalNumber: number): string {
  const decimalString = decimalNumber.toString();

  if (decimalString.includes('.')) {
    return decimalString;
  }
  if (decimalNumber / Math.floor(decimalNumber) === 1) {
    return decimalString + '.0';
  }

  return decimalString;
}
