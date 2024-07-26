export const getSigneeAccount = (
  account: IAccount,
  signees?: IProofOfUsSignee[],
): IProofOfUsSignee => {
  const signer = signees?.find((c) => c.accountName === account.accountName);

  // TODO: probably add a list of keys that need to sign
  const publicKey = account.devices[0].guard.keys[0];
  if (signer) return signer;

  delete account.isReady;

  return {
    ...account,
    accountName: account.accountName,
    alias: account.alias,
    initiator: false,
    signerStatus: 'init',
    publicKey,
  };
};
