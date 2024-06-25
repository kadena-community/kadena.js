// TODO: implement this module

import {
  base64URLdecode,
  createCredential,
  extractPublicKeyHex,
  getPublicKeyForKadena,
  retrieveCredential,
} from '@/utils/webAuthn';
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
    console.log('WEBAUTHN publicKey', publicKey);
    const newKey = {
      publicKey: `WEBAUTHN-${publicKey}`,
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
        base64URLdecode(key.index),
        new TextEncoder().encode(message),
      );
      sigs.push({
        sig: JSON.stringify(cred.response),
        pubKey: `WEBAUTHN-${key.publicKey}`,
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
