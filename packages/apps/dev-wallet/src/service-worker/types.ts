export interface ISetSecurityPhrase {
  action: 'setSecurityPhrase';
  payload: {
    keepPolicy: 'session' | 'short-time' | 'never';
    phrase: string;
    ttl?: number;
  };
}

export interface IGetSecurityPhrase {
  action: 'getSecurityPhrase';
}

export interface IClearSecurityPhrase {
  action: 'clearSecurityPhrase';
}

export interface ISetPhraseResponse {
  result: 'success' | 'failed';
}

export interface IClearPhraseResponse {
  result: 'success' | 'failed';
}

export interface IGetPhraseResponse {
  phrase: string | null;
}

export type ServiceWorkerResponse =
  | ISetPhraseResponse
  | IGetPhraseResponse
  | IClearPhraseResponse;

export type ServiceWorkerMessage =
  | ISetSecurityPhrase
  | IGetSecurityPhrase
  | IClearSecurityPhrase;

export interface SecureContext {
  encryptionKey: Uint8Array;
  encryptionPhrase: [Uint8Array, Uint8Array, Uint8Array];
  keepPolicy: 'session' | 'short-time' | 'never';
  ttl?: number;
}
