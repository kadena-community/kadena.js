import Cookies from 'js-cookie';

export const prefix = '_persist';

export const getName = (key: string): string => `${prefix}:${key}`;

export const setItem = (key: string, value: any) =>
  Cookies.set(getName(key), encodeURIComponent(JSON.stringify(value)));

export const getItem = (key: string) => {
  try {
    const cookie = Cookies.get(getName(key));
    return cookie ? JSON.parse(decodeURIComponent(cookie)) : undefined;
  } catch (e) {
    return undefined;
  }
};

export const deleteItem = (key: string) => Cookies.remove(getName(key) as any);

export const getItems = () => {
  const cookies = Cookies.get();

  if (!cookies) return {};
  return Object.keys(cookies).reduce((results, key) => {
    const match = key.match(getName('(.*)'));
    if (match) results[match[1]] = cookies[key];
    return results;
  }, {});
};

export const purge = () => {
  const cookies = getItems();
  Object.keys(cookies).forEach((key) => {
    deleteItem(key);
  });
};
