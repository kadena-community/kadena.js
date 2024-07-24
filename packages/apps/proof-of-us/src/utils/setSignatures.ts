export const setSignatures = (
  tx: any,
  signees: IProofOfUsSignee[] = [],
): string => {
  const innerTx = tx;
  const { signers } = JSON.parse(innerTx.cmd);
  console.log({ signers, signees });
  const sigs = signers.reduce((acc: any, val: any) => {
    const pubKey = val.pubKey;

    const signee = signees.find((signee) => signee.publicKey === pubKey);

    if (!signee || !signee.signature) return acc;

    acc.push({ sig: signee.signature });

    return acc;
  }, []);

  console.log('signed', { ...innerTx, sigs });

  return { ...innerTx, sigs };
};
