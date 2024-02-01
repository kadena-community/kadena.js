export const createTokenId = async () => {
  return 'testtoken';
};

export const getToken = async (
  tokenId: string,
  account?: IAccount,
): Promise<boolean> => {
  if (!account) return false;
  //TODO: add marmalade pact to get the balance
  return false;
};
