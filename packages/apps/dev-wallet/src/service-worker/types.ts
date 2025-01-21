export type PasswordKeepPolicy =
  | 'session'
  | 'short-time'
  | 'never'
  | 'on-login';

export interface ISetSecurityPhrase {
  action: 'setSecurityPhrase';
  payload: {
    sessionEntropy: string;
    keepPolicy: PasswordKeepPolicy;
    phrase: string;
    ttl?: number;
  };
}

export interface IGetSecurityPhrase {
  action: 'getSecurityPhrase';
  payload: {
    sessionEntropy: string;
  };
}

export interface IClearSecurityPhrase {
  action: 'clearSecurityPhrase';
  payload?: undefined;
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
  keepPolicy: PasswordKeepPolicy;
  ttl?: number;
}
