import { env } from '@/utils/env';

export const isDevEnvironment =
  !!process && process.env.NODE_ENV === 'development';

export const isTestEnvironment =
  env('QA_LEDGER_MOCK', 'disabled') === 'enabled';
