import utf8 from 'utf8';
// @ts-expect-error Could not find a declaration file for module 'pact-lang-api'.
import Pact from 'pact-lang-api';
import { blake2s } from 'blakejs';
import { NetworkName } from './api';
import {
  MAIN_TX_NETWORK_API_URL,
  KADDEX_NETWORK_API_URL,
  TEST_NETWORK_API_URL,
} from '../config/Constants';
import { APIRemoteRoute } from '../config/Routes';

const addPaddingIfNecessary = (str: string) => {
  if (str.length % 4 > 0) {
    return `${str}${'='.repeat(4 - (str.length % 4))}`;
  }
  return str;
};

const encodeUtf8 = (str: string) => {
  return utf8.encode(str);
};

export const decodeBase64ToNumber = (strToDecode: string) => {
  const buff = Buffer.from(
    encodeUtf8(addPaddingIfNecessary(strToDecode)),
    'base64',
  );
  // @ts-expect-error Object is possibly 'null'
  return buff.toString('hex').match(/../g).reverse().join('');
};

export const decodeBase64ToString = (strToDecode: string) => {
  const buff = Buffer.from(
    encodeUtf8(addPaddingIfNecessary(strToDecode)),
    'base64',
  );
  return buff.toString('hex');
};

export const decodeBase64ToJSON = (strToDecode: string) => {
  const buff = Buffer.from(
    encodeUtf8(addPaddingIfNecessary(strToDecode)),
    'base64',
  );
  return JSON.parse(buff.toString('utf8'));
};

export const decodeBase64ToBlakeString = (strToDecode: string) => {
  const buff = Buffer.from(
    encodeUtf8(addPaddingIfNecessary(strToDecode)),
    'base64',
  );
  return Buffer.from(blake2s(buff.slice(0, buff.length - 32), undefined, 32))
    .reverse()
    .toString('hex');
};

const SI_SYMBOL = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z'];
export function abbreviateNumber(number?: string | null, format?: string) {
  if (number === null || number === undefined) {
    return '-';
  }
  const intNumber = number.split('.')[0];
  let tier = Math.floor(intNumber.length / 3);
  let digits = intNumber.length % 3;
  if (tier === 0) return number;
  if (digits === 0 && tier > 0) {
    tier -= 1;
    digits = 3;
  }
  const suffix = SI_SYMBOL[tier];
  const intNumberString = intNumber.substring(0, digits);
  const fracNumberString = intNumber.substring(digits, digits + 2);
  return `${intNumberString || 0}.${fracNumberString} ${suffix}${format || ''}`;
}

export function getAbbreviatedNumber(number?: string | null): number {
  if (number === null || number === undefined) {
    return 0;
  }
  const intNumber = number.split('.')[0];
  const tier = Math.floor(intNumber.length / 3);
  let digits = intNumber.length % 3;
  if (tier === 0) return Number(number);
  if (digits === 0 && tier > 0) {
    digits = 3;
  }
  const intNumberString = intNumber.substring(0, digits);
  const fracNumberString = intNumber.substring(digits, digits + 2);
  return Number(`${intNumberString || 0}.${fracNumberString}`);
}

export const isHexadecimal = (str: string) => {
  const regexp = /^[0-9a-fA-F]+$/;
  return regexp.test(str);
};

export const getPactHost = (
  network: NetworkName,
  version: string,
  instance: string,
  chainId: string,
  customHost?: string | null,
) => {
  switch (network.toLowerCase()) {
    case NetworkName.MAIN_NETWORK.toLowerCase():
      return `${MAIN_TX_NETWORK_API_URL}${APIRemoteRoute.ChainWeb}/${version}/${instance}${APIRemoteRoute.BlockChain}/${chainId}${APIRemoteRoute.Pact}`;
    case NetworkName.TEST_NETWORK.toLowerCase():
      return `${TEST_NETWORK_API_URL}${APIRemoteRoute.ChainWeb}/${version}/${instance}${APIRemoteRoute.BlockChain}/${chainId}${APIRemoteRoute.Pact}`;
    case NetworkName.DEV_NETWORK.toLowerCase():
      return `${KADDEX_NETWORK_API_URL}${APIRemoteRoute.ChainWeb}/${version}/${instance}${APIRemoteRoute.BlockChain}/${chainId}${APIRemoteRoute.Pact}`;
    case NetworkName.CUSTOM_NETWORK.toLowerCase():
      return `${customHost}${APIRemoteRoute.ChainWeb}/${version}/${instance}${APIRemoteRoute.BlockChain}/${chainId}${APIRemoteRoute.Pact}`;
    default:
      return `${MAIN_TX_NETWORK_API_URL}${APIRemoteRoute.ChainWeb}/${version}/${instance}${APIRemoteRoute.BlockChain}/${chainId}${APIRemoteRoute.Pact}`;
  }
};

export function isPrivateKey(sig: string) {
  if (!sig) return false;
  if (sig.length === 64) return true;
  const secretKey = sig.slice(0, 64);
  const publicKey = sig.slice(64);
  const restored = Pact.crypto.restoreKeyPairFromSecretKey(secretKey);
  return restored.secretKey === secretKey && restored.publicKey === publicKey;
}

export const convertDecimal = (decimal: number | string) => {
  decimal = decimal.toString();
  if (decimal.includes('.')) {
    return decimal;
  }
  if (Number(decimal) / Math.floor(Number(decimal)) === 1) {
    decimal += '.0';
  }
  return decimal;
};
