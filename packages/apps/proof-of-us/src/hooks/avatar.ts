import { store } from '@/utils/socket/store';

export const useAvatar = () => {
  const addBackground = async (
    proofOfUs: IProofOfUsData,
    bg: IProofOfUsBackground,
  ) => {
    if (!proofOfUs) return;
    await store.addBackground(proofOfUs, bg);
  };

  const removeBackground = async (proofOfUs: IProofOfUsData) => {
    await store.removeBackground(proofOfUs);
  };

  const uploadBackground = async (proofOfUsId: string) => {
    await fetch('/api/upload', {
      method: 'POST',
      body: JSON.stringify({
        proofOfUsId,
      }),
    });
  };

  return {
    addBackground,
    removeBackground,
    uploadBackground,
  };
};
