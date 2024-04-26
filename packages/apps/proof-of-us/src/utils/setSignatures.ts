export const setSignatures = (
  tx: string,
  signees: IProofOfUsSignee[] = [],
): string => {
  const innerTx = JSON.parse(Buffer.from(tx, 'base64').toString());
  const { signers } = JSON.parse(innerTx.cmd);
  const sigs = signers.reduce((acc: any, val: any) => {
    const pubKey = val.pubKey;

    const signee = signees.find((signee) => signee.publicKey === pubKey);

    if (!signee || !signee.signature) return acc;

    acc.push({ sig: signee.signature });

    return acc;
  }, []);

  return Buffer.from(JSON.stringify({ ...innerTx, sigs })).toString('base64');
};
