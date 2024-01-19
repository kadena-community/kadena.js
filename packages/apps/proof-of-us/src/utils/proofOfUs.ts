import { proofOfUsData } from './data';

export const getAllProofOfUs = async (): Promise<IProofOfUs[]> => {
  return proofOfUsData;
};
export const getProofOfUs = async (
  id: string,
): Promise<IProofOfUs | undefined> => {
  return proofOfUsData.find((proofOfUs) => proofOfUs.id === id);
};
