import type { ISocketContext } from '@/components/SocketProvider/SocketProvider';
import { SocketContext } from '@/components/SocketProvider/SocketProvider';

import { useContext } from 'react';

export const useSocket = (): ISocketContext => useContext(SocketContext);
