'use client';
import { useAccount } from '@/hooks/account';
import { getSigneeAccount } from '@/utils/getSigneeAccount';
import { store } from '@/utils/socket/store';
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
  const { account } = useAccount();
  const params = useParams();
  const [proofOfUs, setProofOfUs] = useState<IProofOfUsData>();
  const [background, setBackground] = useState<IProofOfUsBackground>('');

  useEffect(() => {
    store.listenProofOfUsData(`${params.id}`, setProofOfUs);
    store.listenProofOfUsBackgroundData(`${params.id}`, setBackground);
  }, []);

  const updateStatus = async ({
    proofOfUsId,
    status,
  }: {
    proofOfUsId: string;
    status: IBuildStatusValues;
  }) => {
    await store.updateStatus(proofOfUsId, status);
  };

  const closeToken = async ({ proofOfUsId }: { proofOfUsId: string }) => {
    await store.closeToken(proofOfUsId);
  };

  const updateSigneeStatus = async (status: ISignerStatus) => {
    if (!account || !proofOfUs) return;

    const signer = proofOfUs.signees.find((c) => c.cid === account.cid);

    await store.updateSignee(
      proofOfUs.proofOfUsId,
      signer ? signer : getSigneeAccount(account),
      status,
    );
  };

  const addSignee = async () => {
    if (!account || !proofOfUs) return;

    await store.addSignee(proofOfUs, getSigneeAccount(account));
  };

  const removeSignee = async ({
    proofOfUsId,
    signee,
  }: {
    proofOfUsId: string;
    signee: IProofOfUsSignee;
  }) => {
    if (!proofOfUs) return;
    await store.removeSignee(proofOfUs, signee);
  };

  const createToken = async ({ proofOfUsId }: { proofOfUsId: string }) => {
    if (!account) return;

    await store.createProofOfUs(proofOfUsId, getSigneeAccount(account));
  };

  const isConnected = () => {
    return !!proofOfUs?.signees?.find((s) => s.cid === account?.cid);
  };

  const isInitiator = () => {
    const foundAccount = proofOfUs?.signees.find((s) => s.cid === account?.cid);
    return !!foundAccount?.initiator;
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
