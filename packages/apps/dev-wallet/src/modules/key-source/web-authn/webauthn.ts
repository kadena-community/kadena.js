// TODO: implement this module

import {
  createCredential,
  getPublicKeyForKadena,
  retrieveCredential,
} from '@/utils/webAuthn';

import { base64UrlDecodeArr } from '@kadena/cryptography-utils';

import { IKeySource } from '../../wallet/wallet.repository';
import { IWebAuthn, keySourceRepository } from '../key-source.repository';

export function createWebAuthnService() {
  let connected = true;

  const isConnected = () => Boolean(connected);
  const disconnect = () => {
    connected = true;
  };

  const register = async (profileId: string): Promise<IWebAuthn> => {
    if (!window.PublicKeyCredential) {
      throw new Error('WebAuthn not supported');
    }
    const keySource: IWebAuthn = {
      uuid: crypto.randomUUID(),
      profileId,
      source: 'web-authn',
      keys: [],
    };
    await keySourceRepository.addKeySource(keySource);
    connected = true;
    return keySource;
  };

  const connect = async (keySource: IKeySource) => {
    if (!window.PublicKeyCredential) {
      throw new Error('WebAuthn not supported');
    }
    if (keySource.source !== 'web-authn') {
      throw new Error('Invalid key source');
    }
    connected = true;
  };

  const getPublicKey = async () => {
    throw new Error('getPublicKey is not implemented for web-authn');
  };

  const createKey = async (keySourceId: string) => {
    if (!connected) {
      throw new Error('Wallet not unlocked');
    }
    const keySource = await keySourceRepository.getKeySource(keySourceId);
    if (!keySource || keySource.source !== 'web-authn') {
      throw new Error('Invalid key source');
    }
    if (!connected) {
      throw new Error('Wallet not unlocked');
    }
    const credential = await createCredential();
    if (!credential || !credential.credential) {
      throw new Error('Error creating credential');
    }
    const pkBuffer = credential.credential.response.getPublicKey();
    if (!pkBuffer) {
      throw new Error('Error getting public key');
    }
    const publicKey = await getPublicKeyForKadena(
      credential.credential.response.attestationObject,
    );
    const newKey = {
      publicKey: `WEBAUTHN-${publicKey}`,
      scheme: 'WebAuthn' as const,
      index: credential.credential.id,
    };

    keySource.keys.push(newKey);
    await keySourceRepository.updateKeySource(keySource);
    return newKey;
  };

  const sign = async (keySourceId: string, message: string, ids: string[]) => {
    if (!connected) {
      throw new Error('Wallet not unlocked');
    }
    const keySource = await keySourceRepository.getKeySource(keySourceId);
    if (!keySource || keySource.source !== 'web-authn') {
      throw new Error('Invalid key source');
    }
    if (!connected) {
      throw new Error('Wallet not unlocked');
    }
    const sigs: Array<{ sig: string; pubKey: string }> = [];
    for (const id of ids) {
      const key = keySource.keys.find((k) => k.index === id);
      if (!key) {
        throw new Error('Key not found');
      }
      const cred = await retrieveCredential(
        base64UrlDecodeArr(key.index),
        base64UrlDecodeArr(message),
      );

      const base64 = (buffer: ArrayBuffer) =>
        Buffer.from(buffer).toString('base64');

      sigs.push({
        sig: JSON.stringify({
          signature: base64(cred.response.signature),
          authenticatorData: base64(cred.response.authenticatorData),
          clientDataJSON: base64(cred.response.clientDataJSON),
        }),
        pubKey: key.publicKey,
      });
    }
    return sigs;
  };

  return {
    isConnected,
    disconnect,
    register,
    connect,
    createKey,
    getPublicKey,
    sign,
    clearCache: () => {},
  };
}

export type WebAuthnService = ReturnType<typeof createWebAuthnService>;
