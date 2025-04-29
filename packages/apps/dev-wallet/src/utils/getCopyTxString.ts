import { IUnsignedCommand } from '@kadena/client';
import { base64UrlEncodeArr } from '@kadena/cryptography-utils';

export const getCopyTxString = (tx: IUnsignedCommand) => {
  const encodedTx = base64UrlEncodeArr(
    new TextEncoder().encode(
      JSON.stringify({
        hash: tx.hash,
        cmd: tx.cmd,
        sigs: tx.sigs,
      }),
    ),
  );

  const baseUrl = `${window.location.protocol}//${window.location.host}`;

  return `${baseUrl}/sig-builder#${encodedTx}`;
};
