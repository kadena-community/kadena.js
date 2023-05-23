import { genKeyPair } from '@kadena/cryptography-utils';
import { IKeyPair } from '@kadena/types';

import { downloadFileToBrowser } from '../utils/file-download';

export function generateKeyPair(): IKeyPair {
  return genKeyPair();
}

export function downloadKeyPairToBrowser(keyPair: IKeyPair): void {
  downloadFileToBrowser(
    'key-pair.txt',
    `public: ${keyPair.publicKey}\r\nprivate: ${keyPair.secretKey}`,
  );
}
