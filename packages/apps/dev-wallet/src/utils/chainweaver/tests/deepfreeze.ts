// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deepfreeze = (obj: any) => {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    if (
      Object.prototype.hasOwnProperty.call(obj, prop) &&
      obj[prop] !== null &&
      (typeof obj[prop] === 'object' || typeof obj[prop] === 'function') &&
      !Object.isFrozen(obj[prop])
    ) {
      deepfreeze(obj[prop]);
    }
  });
  return obj;
};
