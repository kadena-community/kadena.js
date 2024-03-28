export const isAlreadySigning = (proofOfUs?: IProofOfUsData): boolean => {
  return !!proofOfUs?.isReadyToSign;
};

export const getAccountSignee = (
  signees?: IProofOfUsSignee[],
  account?: IAccount,
): IProofOfUsSignee | undefined => {
  if (!account || !signees) return;

  return signees.find((s) => s.accountName === account.accountName);
};

export const isSignedOnce = (signees?: IProofOfUsSignee[]): boolean => {
  if (!signees) return false;
  const signinglist = signees.filter((s) => s.signerStatus === 'success');

  return !!signinglist.length;
};

export const haveAllSigned = (signees: IProofOfUsSignee[]): boolean => {
  const signinglist = signees.filter((s) => s.signerStatus !== 'success');

  return !!signinglist.length;
};

export const isReadyToMint = (signees?: IProofOfUsSignee[]): boolean => {
  if (!signees) return false;
  const signinglist = signees.filter(
    (s) => s.signerStatus === 'success' && !s.initiator,
  );

  return signinglist.length >= signees.length - 1;
};
