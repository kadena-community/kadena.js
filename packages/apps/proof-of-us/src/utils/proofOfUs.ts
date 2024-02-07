import { proofOfUsData } from './data';

export const getAllProofOfUs = async (): Promise<IProofOfUs[]> => {
  return proofOfUsData;
};
export const getProofOfUs = async (id: string): Promise<IProofOfUsToken> => {
  console.log(proofOfUsData, id);
  const result = proofOfUsData.find(
    (proofOfUs) => proofOfUs.token?.tokenId === id,
  );

  console.log(222, result);
  const token = result?.token;

  return {
    ...token,
  } as IProofOfUsToken;
};
