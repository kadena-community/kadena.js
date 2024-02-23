export const getSigneeAccount = (
  account: IAccount,
  proofOfUs?: IProofOfUsData,
): IProofOfUsSignee => {
  const signer = proofOfUs?.signees.find(
    (c) => c.accountName === account.accountName,
  );

  console.log(22222222, {
    account: account.accountName,
    signees: proofOfUs?.signees,
  });

  const credential = account.credentials[0];
  console.log('signer', signer);
  if (signer) return signer;

  console.log(111111111);

  return {
    accountName: account.accountName,
    alias: account.alias,
    initiator: false,
    signerStatus: 'init',
    publicKey: credential.publicKey,
  };
};
