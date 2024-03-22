export const getSigneeAccount = (
  account: IAccount,
  signees: IProofOfUsSignee[],
): IProofOfUsSignee => {
  console.log({ signees });
  const signer = signees.find((c) => c.accountName === account.accountName);

  const credential = account.credentials[0];
  if (signer) return signer;

  return {
    accountName: account.accountName,
    alias: account.alias,
    initiator: false,
    signerStatus: 'init',
    publicKey: credential.publicKey,
  };
};
