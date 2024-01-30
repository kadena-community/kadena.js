import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { IAccount, IProofOfUs, IProofOfUsSignee } from '@/types';
import { useAccount } from './account';
import { useGetProofOfUs } from './getProofOfUs';
import { useSocket } from './socket';

export const useProofOfUs = () => {
  const { socket } = useSocket();
  const { account } = useAccount();
  const [state, setState] = useState<IProofOfUs>();
  const params = useParams();

  const { data, isLoading, error } = useGetProofOfUs({ id: params.id });

  useEffect(() => {
    if (!socket) return;
    socket.on('getProofOfUs', ({ content }) => {
      setState(content);
    });
  }, [socket]);

  const addSignee = async ({ tokenId }: { tokenId: string }) => {
    if (!socket || !account) return;

    socket?.emit('addSignee', {
      content: {
        name: account.name,
        cid: account.cid,
        publicKey: account.publicKey,
        initiator: false,
      },
      to: tokenId,
    });
  };

  const removeSignee = async ({
    tokenId,
    signee,
  }: {
    tokenId: string;
    signee: IProofOfUsSignee;
  }) => {
    socket?.emit('removeSignee', {
      content: signee,
      to: tokenId,
    });
  };

  const createToken = async ({ tokenId }: { tokenId: string }) => {
    if (!socket || !account) return;

    socket?.emit('createToken', {
      content: {
        name: account.name,
        cid: account.cid,
        publicKey: account.publicKey,
        initiator: false,
      },
      to: tokenId,
    });
  };

  const isConnected = () => {
    return !!state?.signees.find((s) => s.cid === account?.cid);
  };

  const isInitiator = () => {
    const foundAccount = state?.signees.find((s) => s.cid === account?.cid);
    return !!foundAccount?.initiator;
  };

  const getSigneeAccount = (account: IAccount): IProofOfUsSignee => {
    return {
      cid: account.cid,
      name: account.name,
      publicKey: account.publicKey,
      initiator: false,
    };
  };

  return {
    addSignee,
    removeSignee,
    createToken,
    isConnected,
    isInitiator,
    getSigneeAccount,
    proofOfUs: { ...data, ...state },
    isLoading,
    error,
  };
};
