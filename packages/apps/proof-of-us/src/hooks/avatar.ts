import { store } from '@/utils/socket/store';
import { useProofOfUs } from './proofOfUs';

export const useAvatar = () => {
  const { background } = useProofOfUs();
  const addBackground = async (
    proofOfUs: IProofOfUsData,
    bg: IProofOfUsBackground,
  ) => {
    if (!proofOfUs) return;
    await store.addBackground(proofOfUs, bg);
  };

  const uploadBackground = async (proofOfUsId: string) => {
    const result = await fetch('/api/upload', {
      method: 'POST',
      body: JSON.stringify({
        proofOfUsId,
      }),
    });

    console.log({ result });
  };

  return {
    addBackground,
    uploadBackground,
  };
};
