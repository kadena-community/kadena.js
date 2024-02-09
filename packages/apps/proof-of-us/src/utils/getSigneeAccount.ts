export const getSigneeAccount = (
  account: IAccount,
  proofOfUs?: IProofOfUsData,
): IProofOfUsSignee => {
  const signer = proofOfUs?.signees.find((c) => c.cid === account.cid);

  if (signer) return signer;

  return {
    cid: account.cid,
    displayName: account.displayName,
    publicKey: account.publicKey,
    initiator: false,
    signerStatus: 'init',
  };
};
