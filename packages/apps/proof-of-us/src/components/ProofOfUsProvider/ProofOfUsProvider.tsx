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
  removeSignee: ({
    proofOfUsId,
    signee,
  }: {
    proofOfUsId: string;
    signee: IProofOfUsSignee;
  }) => Promise<void>;
  createToken: ({ proofOfUsId }: { proofOfUsId: string }) => Promise<void>;
  addTx: (tx: string) => Promise<void>;
  changeTitle: (value: string) => Promise<void>;
  updateBackgroundColor: (value: string) => Promise<void>;
  isConnected: () => boolean;
  isInitiator: () => boolean;
  getSigneeAccount: (account: IAccount) => IProofOfUsSignee;
  updateSigner: (value: any, isOverwrite?: boolean) => Promise<void>;
}

export const ProofOfUsContext = createContext<IProofOfUsContext>({
  proofOfUs: undefined,
  background: {
    bg: '',
  },
  closeToken: async () => {},
  updateStatus: async () => {},
  addSignee: async () => {},
  removeSignee: async () => {},
  createToken: async () => {},
  changeTitle: async () => {},
  updateBackgroundColor: async () => {},
  isConnected: () => false,
  isInitiator: () => false,
  updateSigner: async () => {},
  addTx: async () => {},
  getSigneeAccount: (account: IAccount) => {
    return {
      accountName: account.accountName,
      alias: account.alias,
      initiator: false,
      signerStatus: 'init',
    };
  },
});

export const ProofOfUsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { account } = useAccount();
  const params = useParams();
  const [proofOfUs, setProofOfUs] = useState<IProofOfUsData>();
  const [background, setBackground] = useState<IProofOfUsBackground>({
    bg: '',
  });

  useEffect(() => {
    store.listenProofOfUsData(`${params.id}`, setProofOfUs);
    store.listenProofOfUsBackgroundData(`${params.id}`, setBackground);
  }, [setProofOfUs, setBackground, params.id]);

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

  const addSignee = async () => {
    if (!account || !proofOfUs) return;

    await store.addSignee(proofOfUs, getSigneeAccount(account, proofOfUs));
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
    await store.createProofOfUs(
      proofOfUsId,
      getSigneeAccount(account, proofOfUs),
    );
  };

  const changeTitle = async (value: string) => {
    if (!proofOfUs) return;

    await store.addTitle(proofOfUs, value);
  };

  const updateBackgroundColor = async (value: string) => {
    if (!proofOfUs) return;

    await store.updateBackgroundColor(proofOfUs, value);
  };

  const updateSigner = async (value: any, updateSigner: boolean = false) => {
    if (!proofOfUs || !account) return;
    await store.updateSigner(
      proofOfUs,
      getSigneeAccount(account, proofOfUs),
      value,
      updateSigner,
    );
  };

  const isConnected = () => {
    return !!proofOfUs?.signees?.find(
      (s) => s.accountName === account?.accountName,
    );
  };

  const isInitiator = () => {
    const foundAccount = proofOfUs?.signees.find(
      (s) => s.accountName === account?.accountName,
    );
    return !!foundAccount?.initiator;
  };

  const addTx = async (tx: string) => {
    if (!proofOfUs || !account) return;

    await store.updateTx(proofOfUs, tx);
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
        updateStatus,
        changeTitle,
        updateBackgroundColor,
        updateSigner,
        addTx,
      }}
    >
      {children}
    </ProofOfUsContext.Provider>
  );
};
