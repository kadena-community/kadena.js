import { useSocket } from './socket';

export const useAvatar = () => {
  const { socket } = useSocket();

  const setBackgroundSocket = async (tokenId: string, bg: string) => {
    socket?.emit('setBackground', {
      content: {
        bg,
      },
      to: tokenId,
    });
  };

  const uploadBackground = async (tokenId: string, bg: string) => {
    socket?.emit('uploadBackground', {
      content: {
        bg,
      },
      to: tokenId,
    });

    socket?.on('uploadBackgroundStatus', console.log);
  };

  return {
    setBackgroundSocket,
    uploadBackground,
  };
};
