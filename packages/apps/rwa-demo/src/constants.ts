export const ACCOUNT_COOKIE_NAME = 'rwa';
export const LOCALSTORAGE_ASSETS_KEY = 'assets';
export const LOCALSTORAGE_ASSETS_SELECTED_KEY = 'selected_asset';
export const LOCALSTORAGE_ACCOUNTS = 'accounts';
export const INFINITE_COMPLIANCE = -1;
export const NETWORK_POLLING_RATE = 1000 * 30; /* 30 sec */

export const ALLOWEDFILETYPES = () => ['text/csv'];

export const WALLETTYPES = {
  CHAINWEAVER: 'CHAINWEAVER',
  ECKO: 'ECKO',
  MAGIC: 'MAGIC',
} as const;
