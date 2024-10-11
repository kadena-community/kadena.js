export function forEachKey<T extends object>(
  obj: T,
  callback: (key: keyof T, value: T[keyof T]) => void,
) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      callback(key as keyof T, obj[key]);
    }
  }
}
