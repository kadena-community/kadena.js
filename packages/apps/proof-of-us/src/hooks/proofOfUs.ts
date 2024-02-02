import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAccount } from './account';
import { useGetProofOfUs } from './getProofOfUs';
import { useSocket } from './socket';

export const useProofOfUs = () => {
  const { socket } = useSocket();
  const { account } = useAccount();
  const params = useParams();

  const { data, isLoading, error } = useGetProofOfUs({ id: params.id });
  const [proofOfUs, setProofOfUs] = useState<IProofOfUs>();
  const [state, setState] = useState<IProofOfUs>();

  useEffect(() => {
    if (!data) return;
    setProofOfUs({ ...data, ...state });
  }, [data, state]);

  const setContent = ({ content }: { content: IProofOfUs }) => {
    console.log('setcontent', content);
    setState(content);
  };

  useEffect(() => {
    if (!state) {
      socket?.emit('getProofOfUs', {
        to: params.id,
      });
    }
  }, [state]);

  useEffect(() => {
    if (!socket) return;
    socket.on('getProofOfUs', setContent);

    return () => {
      socket.off('getProofOfUs');
    };
  }, []);

  const closeToken = async ({ proofOfUsId }: { proofOfUsId: string }) => {
    socket?.emit('closeToken', {
      to: proofOfUsId,
    });
  };

  const addSignee = async ({ proofOfUsId }: { proofOfUsId: string }) => {
    if (!socket || !account) return;

    socket?.emit('addSignee', {
      content: {
        displayName: account.displayName,
        cid: account.cid,
        publicKey: account.publicKey,
        initiator: false,
      },
      to: proofOfUsId,
    });
  };

  const removeSignee = async ({
    proofOfUsId,
    signee,
  }: {
    proofOfUsId: string;
    signee: IProofOfUsSignee;
  }) => {
    socket?.emit('removeSignee', {
      content: signee,
      to: proofOfUsId,
    });
  };

  const createToken = async ({ proofOfUsId }: { proofOfUsId: string }) => {
    if (!socket || !account) return;

    socket?.emit('createToken', {
      content: {
        displayName: account.displayName,
        cid: account.cid,
        publicKey: account.publicKey,
        initiator: false,
      },
      to: proofOfUsId,
    });
  };

  const isConnected = () => {
    return !!proofOfUs?.signees?.find((s) => s.cid === account?.cid);
  };

  const isInitiator = () => {
    const foundAccount = proofOfUs?.signees.find((s) => s.cid === account?.cid);
    return !!foundAccount?.initiator;
  };

  const getSigneeAccount = (account: IAccount): IProofOfUsSignee => {
    return {
      cid: account.cid,
      displayName: account.displayName,
      publicKey: account.publicKey,
      initiator: false,
    };
  };

  return {
    closeToken,
    addSignee,
    removeSignee,
    createToken,
    isConnected,
    isInitiator,
    getSigneeAccount,
    proofOfUs,
    isLoading,
    error,
  };
};
