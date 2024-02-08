export const getSigneeAccount = (account: IAccount): IProofOfUsSignee => {
  return {
    cid: account.cid,
    displayName: account.displayName,
    publicKey: account.publicKey,
    initiator: false,
    signerStatus: 'init',
  };
};
