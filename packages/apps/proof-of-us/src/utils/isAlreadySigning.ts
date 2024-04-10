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

  const signedList = signees.filter((s) => s.signerStatus === 'success');

  const signersLength = signees.length; //all signees, expcept for initiator

  return parseFloat((signedList.length / signersLength).toFixed(3));
};

export const getPercentageAllowedSignees = (
  signees: IProofOfUsSignee[],
): number => {
  if (!signees) return 0;

  const signingList = signees.filter((s) => s.signerStatus !== 'notsigning');

  const signersLength = signees.length; //all signees, expcept for initiator

  return parseFloat((signingList.length / signersLength).toFixed(3));
};

export const isReadyToMint = (signees?: IProofOfUsSignee[]): boolean => {
  if (!signees || signees.length === 0) return false;
  const MINAMOUNT_SIGNERS = 4;
  const MINPERCENTAGE_SIGNERS = 0.51;

  const [, ...signeesMinusInitiator] = signees;
  const signedlist = signeesMinusInitiator.filter(
    (s) => s.signerStatus === 'success',
  );

  if (signees.length < MINAMOUNT_SIGNERS) {
    return signedlist.length === signees.length - 1 && signees.length > 1;
  } else {
    // the amount of signers needs to be at least MINAMOUNT_SIGNERS (minus the initiator)
    if (signedlist.length < MINAMOUNT_SIGNERS - 1) return false;

    return getPercentageSignees(signeesMinusInitiator) > MINPERCENTAGE_SIGNERS;
  }
};

// remove all the nonsigning signees from the list
export const getAllowedSigners = (signees: IProofOfUsSignee[]) => {
  return signees.filter((s) => s.signerStatus !== 'notsigning');
};

export const isReadyToSign = (signees?: IProofOfUsSignee[]): boolean => {
  if (!signees || signees.length === 0) return false;
  const allowedSingers = getAllowedSigners(signees);

  if (allowedSingers.length < 2) return false;

  const MINAMOUNT_SIGNERS = 4;
  const MINPERCENTAGE_SIGNERS = 0.51;

  if (signees.length < MINAMOUNT_SIGNERS) {
    return allowedSingers.length === signees.length;
  } else {
    // the amount of signers needs to be at least MINAMOUNT_SIGNERS
    if (allowedSingers.length < MINAMOUNT_SIGNERS) return false;

    console.log(getPercentageAllowedSignees(signees));
    return getPercentageAllowedSignees(signees) > MINPERCENTAGE_SIGNERS;
  }
};
