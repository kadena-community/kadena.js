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

export const getPercentageSignees = (signees: IProofOfUsSignee[]): number => {
  if (!signees) return 0;

  const signedList = signees.filter(
    (s) => s.signerStatus === 'success' && !s.initiator,
  );

  const signersLength = signees.length - 1; //all signees, expcept for initiator

  return parseFloat((signedList.length / signersLength).toFixed(3));
};

export const isReadyToMint = (signees?: IProofOfUsSignee[]): boolean => {
  if (!signees || signees.length === 0) return false;
  const MINAMOUNT_SIGNERS = 4;
  const MINPERCENTAGE_SIGNERS = 0.51;

  const signedlist = signees.filter(
    (s) => s.signerStatus === 'success' && !s.initiator,
  );

  if (signees.length < MINAMOUNT_SIGNERS) {
    return signedlist.length === signees.length - 1 && signees.length > 1;
  } else {
    // the amount of signers needs to be at least MINAMOUNT_SIGNERS (minus the initiator)
    if (signedlist.length < MINAMOUNT_SIGNERS - 1) return false;

    return getPercentageSignees(signees) > MINPERCENTAGE_SIGNERS;
  }
};
