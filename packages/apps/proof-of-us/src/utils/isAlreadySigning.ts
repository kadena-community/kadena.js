export const isAlreadySigning = (signees?: IProofOfUsSignee[]): boolean => {
  if (!signees) return false;
  const signinglist = signees.filter((s) => s.signerStatus !== 'init');

  return !!signinglist.length;
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
