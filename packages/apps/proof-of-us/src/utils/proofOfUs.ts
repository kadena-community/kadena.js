import { proofOfUsData } from './data';

export const getAllProofOfUs = async (): Promise<IProofOfUs[]> => {
  return proofOfUsData;
};
export const getProofOfUs = async (id: string): Promise<IProofOfUs> => {
  const result =
    proofOfUsData.find((proofOfUs) => proofOfUs.data.proofOfUsId === id) ??
    ({ background: '', data: {} } as IProofOfUs);

  return {
    ...result,
  } as IProofOfUs;
};
