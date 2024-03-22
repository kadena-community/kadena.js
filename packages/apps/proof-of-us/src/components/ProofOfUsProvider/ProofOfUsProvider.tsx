'use client';
import { useAccount } from '@/hooks/account';
import { useTokens } from '@/hooks/tokens';
import { getSigneeAccount } from '@/utils/getSigneeAccount';
import { isAlreadySigning } from '@/utils/isAlreadySigning';
import { store } from '@/utils/socket/store';
import { useParams } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';

export interface IProofOfUsContext {
  proofOfUs?: IProofOfUsData;
  signees: IProofOfUsSignee[];
  background: IProofOfUsBackground;
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
  updateSignee: (value: any, isOverwrite?: boolean) => Promise<void>;
  createToken: ({ proofOfUsId }: { proofOfUsId: string }) => Promise<void>;
  changeTitle: (value: string) => string;
  updateBackgroundColor: (value: string) => string;
  isConnected: () => boolean;
  isInitiator: () => boolean;
  hasSigned: () => boolean;
  updateProofOfUs: (value: any) => Promise<void>;
}

export const ProofOfUsContext = createContext<IProofOfUsContext>({
  proofOfUs: undefined,
  signees: [],
  background: {
    bg: '',
  },
  updateStatus: async () => {},
  addSignee: async () => {},
  removeSignee: async () => {},
  updateSignee: async () => {},
  createToken: async () => {},
  changeTitle: () => '',
  updateBackgroundColor: () => '',
  isConnected: () => false,
  isInitiator: () => false,
  hasSigned: () => false,
  updateProofOfUs: async () => {},
});

export const ProofOfUsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { account } = useAccount();
  const params = useParams();
  const { addMintingData } = useTokens();
  const [proofOfUs, setProofOfUs] = useState<IProofOfUsData>();
  const [signees, setSignees] = useState<IProofOfUsSignee[]>([]);
  const [background, setBackground] = useState<IProofOfUsBackground>({
    bg: '',
  });

  const listenToProofOfUsData = useCallback(
    async (data: IProofOfUsData | undefined) => {
      let innerData: IProofOfUsData | undefined | null = data;

      if (!innerData && params && params.id !== 'new') {
        innerData = await store.getProofOfUs(`${params.id}`);
        if (!innerData) return;
        innerData = { ...innerData, proofOfUsId: `${params?.id}` };
      }

      if (!innerData) return;

      if (innerData.requestKey) {
        addMintingData(innerData);
      }

      setProofOfUs({ ...innerData });
    },
    [setProofOfUs, params?.id],
  );

  const listenToSigneesData = useCallback(
    async (data: IProofOfUsSignee[]) => {
      let innerData: IProofOfUsSignee[] = data ?? [];

      if (!innerData && params && params.id !== 'new') {
        console.log(3333);
        innerData = await store.getProofOfUsSignees(`${params.id}`);
        if (!innerData) return;
      }

      setSignees([...innerData]);
    },
    [setSignees, params?.id],
  );

  useEffect(() => {
    if (!params?.id || !account) return;
    store.listenProofOfUsData(`${params.id}`, account, listenToProofOfUsData);
    store.listenProofOfUsBackgroundData(`${params.id}`, setBackground);
    store.listenProofOfUsSigneesData(`${params.id}`, listenToSigneesData);

    // return () => {
    //   unListen();
    //   unListenBackgroundData();
    // };
  }, [account]);

  const updateStatus = async ({
    proofOfUsId,
    status,
  }: {
    proofOfUsId: string;
    status: IBuildStatusValues;
  }) => {
    if (!proofOfUs) return;
    await store.updateStatus(proofOfUsId, proofOfUs, status);
  };

  const addSignee = async () => {
    if (!account || !proofOfUs) return;
    await store.addSignee(
      proofOfUs,
      signees,
      getSigneeAccount(account, signees),
    );
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

  const updateSignee = async (
    value: any,
    isOverwrite: boolean = false,
  ): Promise<void> => {
    console.log(111);
    if (!proofOfUs || !account) return;
    if (!account) return;
    console.log(222);
    if (!isOverwrite && isAlreadySigning(proofOfUs)) return;

    console.log(3333);
    const signee = signees.find((a) => a.accountName === account.accountName);

    console.log(4444, signee);
    if (!signee) return;

    console.log('signeeeee', { signee, signees });
    await store.updateSignee(proofOfUs, { ...signee, ...value });
  };

  const createToken = async ({ proofOfUsId }: { proofOfUsId: string }) => {
    if (!account) return;
    await store.createProofOfUs(
      proofOfUsId,
      getSigneeAccount(account, signees),
    );
  };

  const changeTitle = (value: string) => {
    if (isAlreadySigning(proofOfUs)) return proofOfUs?.title ?? '';
    return value;
  };

  const updateBackgroundColor = (value: string) => {
    if (isAlreadySigning(proofOfUs)) return proofOfUs?.backgroundColor ?? '';
    return value;
  };

  const updateProofOfUs = async (value: any) => {
    if (!proofOfUs || !account) return;
    await store.updateProofOfUs(proofOfUs, value);
  };

  const hasSigned = (): boolean => {
    const signee = signees.find((s) => s.accountName === account?.accountName);

    return signee?.signerStatus === 'success';
  };

  const isConnected = () => {
    return !!signees.find((s) => s.accountName === account?.accountName);
  };

  const isInitiator = () => {
    const foundAccount = signees.find(
      (s) => s.accountName === account?.accountName,
    );
    return !!foundAccount?.initiator;
  };

  return (
    <ProofOfUsContext.Provider
      value={{
        addSignee,
        removeSignee,
        updateSignee,
        createToken,
        isConnected,
        isInitiator,
        background,
        proofOfUs,
        signees,
        updateStatus,
        changeTitle,
        updateBackgroundColor,
        updateProofOfUs,
        hasSigned,
      }}
    >
      {children}
    </ProofOfUsContext.Provider>
  );
};
