import type { IFabricCanvasObject } from '@/fabricTypes';
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

  const addObject = async (
    tokenId: string,
    object: IFabricCanvasObject,
    previousState?: IFabricCanvasObject,
  ) => {
    delete previousState?.previousState;
    socket?.emit('addObject', {
      content: {
        newState: object,
        previousState,
      },
      to: tokenId,
    });
  };

  return {
    setBackgroundSocket,
    addObject,
  };
};
