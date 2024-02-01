import { proofOfUsData } from './data';

export const getAllProofOfUs = async (): Promise<IProofOfUs[]> => {
  return proofOfUsData;
};
export const getProofOfUs = async (
  id: string,
): Promise<IProofOfUs | undefined> => {
  const result = proofOfUsData.find(
    (proofOfUs) => proofOfUs.proofOfUsId === id,
  );

  return {
    ...result,
    avatar: {
      background: '',
      objects: [],
    },
  } as IProofOfUs;
};
