import { genKeyPair } from '@kadena/cryptography-utils';
import { downloadFileToBrowser } from 'services/utils/file-download';

export function generateKeyPair(): void {
  const keyPair = genKeyPair();

  downloadFileToBrowser(
    'key-pair.txt',
    `public: ${keyPair.publicKey}\r\nprivate: ${keyPair.secretKey}`,
  );
}
