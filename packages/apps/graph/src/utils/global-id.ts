export type IDKeysArray = (string | number | bigint)[];

export const createID = (
  objectType: string,
  keys: IDKeysArray | string,
): string =>
  Buffer.from(
    `${objectType}:${Array.isArray(keys) ? JSON.stringify(keys) : keys}`,
  ).toString('base64');

export const parseID = (id: string): IDKeysArray | string => {
  const key = id.split(':')[1];
  try {
    const parsed = JSON.parse(key);
    return Array.isArray(parsed) ? parsed : key;
  } catch (error) {
    return key;
  }
};
