import Cookies from 'js-cookie';

export const prefix = '_persist';

export const getName = (key: string) => `${prefix}:${key}`;

export const encode = (value: unknown) =>
  encodeURIComponent(JSON.stringify(value));

export const parse = (value: string) => JSON.parse(decodeURIComponent(value));

export const setItem = (key: string, value: unknown) =>
  Cookies.set(getName(key), encode(value));

export const getItem = (key: string) => {
  try {
    const cookie = Cookies.get(getName(key));
    return cookie !== undefined ? parse(cookie) : undefined;
  } catch (e) {
    return undefined;
  }
};

export const deleteItem = (key: string) => {
  Cookies.remove(getName(key));
};
export const getItems = () => {
  const cookies = Cookies.get();
  return Object.keys(cookies).reduce(
    (results, key) => {
      const match: null | string[] = key.match(getName('(.*)'));
      if (match) results[match[1]] = cookies[key];
      return results;
    },
    {} as { [key: string]: string },
  );
};

export const purge = () => {
  const cookies = getItems();
  Object.keys(cookies).forEach((key) => {
    deleteItem(key);
  });
};
