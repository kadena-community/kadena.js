export const getSigneeAccount = (
  account: IAccount,
  proofOfUs?: IProofOfUsData,
): IProofOfUsSignee => {
  const signer = proofOfUs?.signees.find(
    (c) => c.accountName === account.accountName,
  );

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
