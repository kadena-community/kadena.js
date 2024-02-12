import { proofOfUsData } from './data';

//TODO: get data from the chain

export const getAllProofOfUs = async (): Promise<IProofOfUsToken[]> => {
  const tokens = proofOfUsData.map((d) => d.token);
  const data = tokens.filter((d) => d?.tokenId);
  return data as IProofOfUsToken[];
};
export const getProofOfUs = async (id: string): Promise<IProofOfUsToken> => {
  const result = proofOfUsData.find(
    (proofOfUs) => proofOfUs.token?.tokenId === id,
  );

  const token = result?.token;

  return {
    ...token,
  } as IProofOfUsToken;
};
