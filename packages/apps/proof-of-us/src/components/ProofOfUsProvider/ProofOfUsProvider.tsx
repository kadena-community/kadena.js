'use client';
import { useAccount } from '@/hooks/account';
import { useGetProofOfUs } from '@/hooks/getProofOfUs';
import { useSocket } from '@/hooks/socket';
import { useParams } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useEffect, useState } from 'react';

export interface IProofOfUsContext {
  proofOfUs?: IProofOfUsData;
  background: IProofOfUsBackground;
  closeToken: ({ proofOfUsId }: { proofOfUsId: string }) => Promise<void>;
  addSignee: () => Promise<void>;
  removeSignee: ({
    proofOfUsId,
    signee,
  }: {
    proofOfUsId: string;
    signee: IProofOfUsSignee;
  }) => Promise<void>;
  createToken: ({ proofOfUsId }: { proofOfUsId: string }) => Promise<void>;
  isConnected: () => boolean;
  isInitiator: () => boolean;
  getSigneeAccount: (account: IAccount) => IProofOfUsSignee;
  isLoading: boolean;
  error: IError | undefined;
}

export const ProofOfUsContext = createContext<IProofOfUsContext>({
  proofOfUs: undefined,
  background: '',
  closeToken: async () => {},
  addSignee: async () => {},
  removeSignee: async () => {},
  createToken: async () => {},
  isConnected: () => false,
  isInitiator: () => false,
  getSigneeAccount: (account: IAccount) => {
    return {
      cid: account.cid,
      displayName: account.displayName,
      publicKey: account.publicKey,
      initiator: false,
    };
  },
  isLoading: false,
  error: undefined,
});

export const ProofOfUsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { socket } = useSocket();
  const { account } = useAccount();
  const params = useParams();
  const { data, isLoading, error } = useGetProofOfUs({ id: params.id });
  const [proofOfUs, setProofOfUs] = useState<IProofOfUsData>();
  const [background, setBackground] = useState<IProofOfUsBackground>('');
  const [state, setState] = useState<IProofOfUsData>();

  useEffect(() => {
    if (!data) return;
    setProofOfUs({ ...data, ...state });
  }, [data, state]);

  const setContent = ({ content }: { content: IProofOfUsData }) => {
    setState(content);
  };

  const setContentBackground = ({
    content,
  }: {
    content: IProofOfUsBackground;
  }) => {
    setBackground(content);
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
    socket.on('getProofOfUsBackground', setContentBackground);

    return () => {
      socket.off('getProofOfUs');
      socket.off('getProofOfUsBackground');
    };
  }, []);

  const closeToken = async ({ proofOfUsId }: { proofOfUsId: string }) => {
    socket?.emit('closeToken', {
      to: proofOfUsId,
    });
  };

  const addSignee = async () => {
    if (!socket || !account || !proofOfUs) return;

    socket?.emit('addSignee', {
      content: {
        displayName: account.displayName,
        cid: account.cid,
        publicKey: account.publicKey,
        initiator: false,
      },
      to: proofOfUs?.proofOfUsId,
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

  return (
    <ProofOfUsContext.Provider
      value={{
        closeToken,
        addSignee,
        removeSignee,
        createToken,
        isConnected,
        isInitiator,
        getSigneeAccount,
        background,
        proofOfUs,
        isLoading,
        error,
      }}
    >
      {children}
    </ProofOfUsContext.Provider>
  );
};
