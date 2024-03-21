export const isAlreadySigning = (proofOfUs?: IProofOfUsData): boolean => {
  return !!proofOfUs?.isReadyToSign;
};

export const isSignedOnce = (signees?: IProofOfUsSignee[]): boolean => {
  if (!signees) return false;
  const signinglist = signees.filter((s) => s.signerStatus === 'success');

  return !!signinglist.length;
};

export const haveAllSigned = (signees?: IProofOfUsSignee[]): boolean => {
  if (!signees) return false;
  const signinglist = signees.filter((s) => s.signerStatus !== 'success');

  return !!signinglist.length;
};
