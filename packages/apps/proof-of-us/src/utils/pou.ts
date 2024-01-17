import { pous } from './data';

export const getAll = async (): Promise<IPou[]> => {
  return pous;
};
export const getPou = async (id: string): Promise<IPou | undefined> => {
  return pous.find((pou) => pou.id === id);
};
