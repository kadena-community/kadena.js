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

  return {
    setBackgroundSocket,
  };
};
