import Cookies from 'js-cookie';

export const prefix = '_persist';

export const getName = (key: string) => `${prefix}:${key}`;

export const encode = (value: unknown) => encodeURIComponent(JSON.stringify(value));

export const parse = (value: string) => JSON.parse(decodeURIComponent(value));

export const setItem = (key: string, value: unknown) => Cookies.set(getName(key), encode(value));

export const getItem = (key: string) => {
  try {
    const cookie = Cookies.get(getName(key));
    return cookie !== undefined ? parse(cookie) : undefined;
  } catch (e) {
    return undefined;
  }
};
