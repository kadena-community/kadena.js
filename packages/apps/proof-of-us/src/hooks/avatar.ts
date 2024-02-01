import { useSocket } from './socket';

export const useAvatar = () => {
  const { socket } = useSocket();

  const setBackgroundSocket = async (proofOfUsId: string, bg: string) => {
    socket?.emit('setBackground', {
      content: {
        bg,
      },
      to: proofOfUsId,
    });
  };

  const uploadBackground = async (proofOfUsId: string, bg: string) => {
    socket?.emit('uploadBackground', {
      content: {
        bg,
      },
      to: proofOfUsId,
    });

    socket?.on('uploadBackgroundStatus', console.log);
  };

  return {
    setBackgroundSocket,
    uploadBackground,
  };
};
