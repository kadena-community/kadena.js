export const VAULT =
  'k:2cf3e52a1e9e961257599a5155cc5ef3e836fc8f70b7edf867cfbf45a07d612d';

export const PRICE_MAP = {
  1: 365,
  2: 730,
};

export const KADENANAMES_NAMESPACE_TESTNET_MODULE =
  'n_32faa22a75da53789d48dcbcb124a11c8f8651a8.herdyracle';
export const KADENANAMES_NAMESPACE_MAINNET_MODULE =
  'n_32faa22a75da53789d48dcbcb124a11c8f8651a8.kadena-names';

export const getNamespaceModule = (networkId: string): string =>
  networkId.includes('testnet')
    ? KADENANAMES_NAMESPACE_TESTNET_MODULE
    : KADENANAMES_NAMESPACE_MAINNET_MODULE;
