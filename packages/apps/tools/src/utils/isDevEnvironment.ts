export const isDevEnvironment =
  !!process && process.env.NODE_ENV === 'development';

export const isTestEnvironment = !!process && process.env.NODE_ENV === 'test';
