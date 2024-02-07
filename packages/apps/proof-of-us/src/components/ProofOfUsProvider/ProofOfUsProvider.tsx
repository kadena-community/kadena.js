'use client';
import { useAccount } from '@/hooks/account';
import { useSocket } from '@/hooks/socket';
import { useParams } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useEffect, useState } from 'react';

export interface IProofOfUsContext {
  proofOfUs?: IProofOfUsData;
  background: IProofOfUsBackground;
  closeToken: ({ proofOfUsId }: { proofOfUsId: string }) => Promise<void>;
  updateStatus: ({
    proofOfUsId,
    status,
  }: {
    proofOfUsId: string;
    status: IBuildStatusValues;
  }) => Promise<void>;
  addSignee: () => Promise<void>;
  updateSigneeStatus: (status: ISignerStatus) => Promise<void>;
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
}

export const ProofOfUsContext = createContext<IProofOfUsContext>({
  proofOfUs: undefined,
  background: '',
  closeToken: async () => {},
  updateStatus: async () => {},
  addSignee: async () => {},
  updateSigneeStatus: async (status: ISignerStatus) => {},
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
      signerStatus: 'init',
    };
  },
});

export const ProofOfUsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { socket } = useSocket();
  const { account } = useAccount();
  const params = useParams();
  const [proofOfUs, setProofOfUs] = useState<IProofOfUsData>();
  const [background, setBackground] = useState<IProofOfUsBackground>('');

  const setContent = ({ content }: { content: IProofOfUsData }) => {
    setProofOfUs(content);
  };

  const setContentBackground = ({
    content,
  }: {
    content: IProofOfUsBackground;
  }) => {
    setBackground(content);
  };

  useEffect(() => {
    if (!proofOfUs) {
      socket?.emit('getProofOfUs', {
        to: params.id,
      });
    }
  }, [proofOfUs]);

  useEffect(() => {
    if (!socket) return;
    socket.on('getProofOfUs', setContent);
    socket.on('getProofOfUsBackground', setContentBackground);

    return () => {
      socket.off('getProofOfUs');
      socket.off('getProofOfUsBackground');
    };
  }, []);

  const updateStatus = async ({
    proofOfUsId,
    status,
  }: {
    proofOfUsId: string;
    status: IBuildStatusValues;
  }) => {
    socket?.emit('updateStatus', {
      content: {
        status,
      },
      to: proofOfUsId,
    });
  };

  const closeToken = async ({ proofOfUsId }: { proofOfUsId: string }) => {
    socket?.emit('closeToken', {
      to: proofOfUsId,
    });
  };

  const updateSigneeStatus = async (status: ISignerStatus) => {
    if (!socket || !account || !proofOfUs) return;

    socket?.emit('updateSigneeStatus', {
      content: {
        displayName: account.displayName,
        cid: account.cid,
        publicKey: account.publicKey,
        initiator: false,
        signerStatus: status,
      } as IProofOfUsSignee,
      to: proofOfUs?.proofOfUsId,
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
      signerStatus: 'init',
    };
  };

  return (
    <ProofOfUsContext.Provider
      value={{
        closeToken,
        addSignee,
        updateSigneeStatus,
        removeSignee,
        createToken,
        isConnected,
        isInitiator,
        getSigneeAccount,
        background,
        proofOfUs,
        updateStatus,
      }}
    >
      {children}
    </ProofOfUsContext.Provider>
  );
};
