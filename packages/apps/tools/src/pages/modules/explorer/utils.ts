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

// Function signature when defaultValue is provided
export function getCookieValue<Expected>(
  needle: string,
  haystack: NextApiRequestCookies,
  defaultValue: Expected,
): Expected;

// Function signature when defaultValue is not provided
export function getCookieValue<Expected>(
  needle: string,
  haystack: NextApiRequestCookies,
): Expected | null;

// Implementation of the function
export function getCookieValue<Expected>(
  needle: string,
  haystack: NextApiRequestCookies,
  defaultValue?: Expected,
): Expected | null {
  const encoded = encodeURIComponent(getName(needle));
  const value = haystack[encoded];
  if (typeof value !== 'undefined') {
    return parse(value) as Expected;
  }
  return defaultValue ?? null;
}
