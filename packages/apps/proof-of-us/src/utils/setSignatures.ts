import { IUnsignedCommand } from '@kadena/client';

export const setSignatures = (
  tx: any,
  signees: IProofOfUsSignee[] = [],
): IUnsignedCommand => {
  const innerTx = tx;
  const { signers } = JSON.parse(innerTx.cmd);
  const sigs = signers.reduce((acc: any, val: any) => {
    const pubKey = val.pubKey;

    const signee = signees.find((signee) => signee.publicKey === pubKey);

    if (!signee || !signee.signature) return acc;

    acc.push({ sig: signee.signature });

    return acc;
  }, []);

  return { ...innerTx, sigs };
};
