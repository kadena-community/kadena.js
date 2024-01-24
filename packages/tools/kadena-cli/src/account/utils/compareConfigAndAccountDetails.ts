import { IAccountDetailsResult, IAddAccountManualConfig } from '../types.js';

export const validatePublicKeys = (
  publicKeysConfig: string[],
  keys: string[],
): boolean => {
  const publicKeys = publicKeysConfig.filter((key: string) => !!key);

  const hasSamePublicKeysLength = publicKeys.length === keys.length;

  return (
    hasSamePublicKeysLength && keys.every((key) => publicKeys.includes(key))
  );
};

export function compareConfigAndAccountDetails(
  config: IAddAccountManualConfig,
  accountDetails: IAccountDetailsResult,
): boolean {
  const { publicKeys, predicate } = accountDetails;
  const isSameKeys = validatePublicKeys(config.publicKeysConfig, publicKeys);

  const isSamePredicate = config.predicate === predicate;

  return isSameKeys && isSamePredicate;
}
