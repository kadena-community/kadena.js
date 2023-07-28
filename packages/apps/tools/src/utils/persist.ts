import Cookies from 'js-cookie';

export const prefix: string = '_persist';

export const getName = (key: string): string => `${prefix}:${key}`;

export const setItem = (key: string, value: unknown): void => {
  Cookies.set(getName(key), encodeURIComponent(JSON.stringify(value)));
};

export const getItem = (key: string): unknown | undefined => {
  try {
    const cookie = Cookies.get(getName(key));
    return cookie !== undefined
      ? JSON.parse(decodeURIComponent(cookie))
      : undefined;
  } catch (e) {
    return undefined;
  }
};

export const deleteItem = (key: string): void => {
  Cookies.remove(getName(key));
};

export const getItems = (): { [key: string]: unknown } => {
  const cookies = Cookies.get();

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!cookies) return {};
  return Object.keys(cookies).reduce(
    (results, key) => {
      const match: null | string[] = key.match(getName('(.*)'));
      if (match) results[match[1]] = cookies[key];
      return results;
    },
    {} as { [key: string]: string },
  );
};

export const purge = (): void => {
  const cookies = getItems();
  Object.keys(cookies).forEach((key) => {
    deleteItem(key);
  });
};
