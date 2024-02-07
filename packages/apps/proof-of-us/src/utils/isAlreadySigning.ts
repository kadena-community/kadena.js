export const isAlreadySigning = (signees?: IProofOfUsSignee[]): boolean => {
  if (!signees) return false;
  const signinglist = signees.filter((s) => s.signerStatus !== 'init');

  return !!signinglist.length;
};
