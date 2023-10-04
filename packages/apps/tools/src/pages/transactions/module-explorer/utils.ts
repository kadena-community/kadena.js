import { getName, parse } from '@/utils/persist';
import type { ParsedUrlQuery } from 'querystring';
import qs from 'querystring';

export const getQueryValue = (
  needle: string,
  haystack: ParsedUrlQuery,
  validator?: (value: string) => boolean,
): string | undefined => {
  if (typeof haystack[needle] === 'undefined') {
    return undefined;
  }

  const value = Array.isArray(haystack[needle])
    ? (haystack[needle]![0] as string)
    : (haystack[needle] as string);

  if (validator) {
    return validator(value) ? value : undefined;
  }

  return value;
};

export const getCookieValue = (
  needle: string,
  haystack: string,
  defaultValue?: any,
): any | null => {
  const decodedCookieName = decodeURIComponent(getName(needle));
  const cookies = qs.decode(haystack, '; ');

  if (typeof cookies[decodedCookieName] === 'string') {
    return parse(cookies[decodedCookieName] as string);
  }
  return defaultValue ?? null;
};
