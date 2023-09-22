import { getName, parse } from '@/utils/persist';
import type { NextApiRequestCookies } from 'next/dist/server/api-utils';
import type { ParsedUrlQuery } from 'querystring';

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
  haystack: NextApiRequestCookies,
  defaultValue?: string,
): string | null => {
  const encoded = encodeURIComponent(getName(needle));
  if (haystack[encoded]) {
    return parse(haystack[encoded]!);
  }
  return defaultValue ?? null;
};
