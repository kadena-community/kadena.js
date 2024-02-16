export const getSigneeAccount = (
  account: IAccount,
  proofOfUs?: IProofOfUsData,
): IProofOfUsSignee => {
  const signer = proofOfUs?.signees.find(
    (c) => c.accountName === account.accountName,
  );

  if (signer) return signer;

  return {
    accountName: account.accountName,
    alias: account.alias,
    initiator: false,
    signerStatus: 'init',
  };
};
