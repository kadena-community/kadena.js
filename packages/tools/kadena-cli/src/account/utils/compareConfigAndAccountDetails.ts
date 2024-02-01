import type { IAccountDetailsResult, IGuard } from '../types.js';

export const validatePublicKeys = (
  publicKeysConfig: string[],
  keys: string[],
): boolean => {
  const hasSamePublicKeysLength = publicKeysConfig.length === keys.length;

  return (
    hasSamePublicKeysLength &&
    keys.every((key) => publicKeysConfig.includes(key))
  );
};

export function compareConfigAndAccountDetails(
  configGuard: IGuard,
  accountDetails: IAccountDetailsResult,
): boolean {
  const {
    guard: { keys, pred },
  } = accountDetails;
  const isSameKeys = validatePublicKeys(configGuard.keys, keys);

  const isSamePredicate = configGuard.pred === pred;

  return isSameKeys && isSamePredicate;
}
