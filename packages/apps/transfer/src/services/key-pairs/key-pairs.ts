import { genKeyPair } from '@kadena/cryptography-utils';

import { downloadFileToBrowser } from '@/services/utils/file-download';

export function downloadKeyPairToBrowser(): void {
  const keyPair = genKeyPair();

  downloadFileToBrowser(
    `kadena-keypair-${keyPair.publicKey}.txt`,
    `public: ${keyPair.publicKey}\r\nprivate: ${keyPair.secretKey}`,
  );
}
