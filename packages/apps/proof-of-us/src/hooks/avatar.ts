import { store } from '@/utils/socket/store';
import { useSocket } from './socket';

export const useAvatar = () => {
  const { socket } = useSocket();

  const addBackground = async (
    proofOfUs: IProofOfUsData,
    bg: IProofOfUsBackground,
  ) => {
    if (!proofOfUs) return;
    await store.addBackground(proofOfUs, bg);
  };

  const uploadBackground = async (proofOfUsId: string) => {
    socket?.emit('uploadBackground', {
      to: proofOfUsId,
    });

    socket?.on('uploadBackgroundStatus', console.log);
  };

  return {
    addBackground,
    uploadBackground,
  };
};
