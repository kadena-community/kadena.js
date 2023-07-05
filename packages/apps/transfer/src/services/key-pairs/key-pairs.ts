import { genKeyPair } from '@kadena/cryptography-utils';

import { downloadFileToBrowser } from '@/services/utils/file-download';
import Debug from 'debug';

const debug = Debug('kadena-transfer:services:key-pairs');

export function downloadKeyPairToBrowser(): void {
  debug(downloadKeyPairToBrowser.name);
  const keyPair = genKeyPair();

  downloadFileToBrowser(
    `kadena-keypair-${keyPair.publicKey}.txt`,
    `public: ${keyPair.publicKey}\r\nprivate: ${keyPair.secretKey}`,
  );
}
