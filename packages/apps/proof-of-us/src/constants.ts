export const ACCOUNT_COOKIE_NAME = 'waccount';
export const PROOFOFUS_QR_URL = '/scan';
export const DEVWORLD_TOKENID = 't:ZlfM7Ugw86DtzuPN-Xas90vJ0NLl6C62qtJ-QlI_Hxc';

export const BUILDSTATUS: Record<string, IBuildStatusValues> = {
  INIT: 1,
  SHARE: 2,
  COSIGNER: 3,
  UPLOAD: 4,
} as const;
