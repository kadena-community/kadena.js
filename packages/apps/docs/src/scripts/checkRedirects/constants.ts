import redirects from '@/redirects/redirects.mjs';

export const errors: string[] = [];
export const success: string[] = [];

export const httpRegExp = new RegExp(/^https?:/);

export const typedRedirects = redirects as IRedirect[];
