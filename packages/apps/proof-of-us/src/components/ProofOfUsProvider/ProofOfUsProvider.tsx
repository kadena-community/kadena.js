'use client';
import { useAccount } from '@/hooks/account';
import { useTokens } from '@/hooks/tokens';
import { getSigneeAccount } from '@/utils/getSigneeAccount';
import { isAlreadySigning } from '@/utils/isAlreadySigning';
import { store } from '@/utils/socket/store';
import type { IUnsignedCommand } from '@kadena/client';
import { useParams } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';

export interface IProofOfUsContext {
  proofOfUs?: IProofOfUsData;
  signees?: IProofOfUsSignee[];
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
  isConnected: () => Promise<boolean>;
  isInitiator: () => Promise<boolean>;
  hasSigned: () => Promise<boolean>;
  isSignee: () => Promise<boolean>;
  updateProofOfUs: (value: any) => Promise<void>;
  getSignature: (tx: IUnsignedCommand) => Promise<string | undefined>;
}

export const ProofOfUsContext = createContext<IProofOfUsContext>({
  proofOfUs: undefined,
  signees: undefined,
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
  isConnected: async () => false,
  isInitiator: async () => false,
  hasSigned: async () => false,
  isSignee: async () => false,
  updateProofOfUs: async () => {},
  getSignature: async () => undefined,
});

export const ProofOfUsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { account } = useAccount();
  const params = useParams();
  const { addMintingData } = useTokens();
  const [proofOfUs, setProofOfUs] = useState<IProofOfUsData>();
  const [signees, setSignees] = useState<IProofOfUsSignee[]>();
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
        innerData = await store.getProofOfUsSignees(`${params.id}`);
        if (!innerData) return;
      }

      setSignees([...innerData]);
    },
    [setSignees, params?.id],
  );

  //start listeners
  useEffect(() => {
    if (!params?.id || !account) return;
    store.listenProofOfUsData(`${params.id}`, account, listenToProofOfUsData);
    store.listenProofOfUsBackgroundData(`${params.id}`, setBackground);
    store.listenProofOfUsSigneesData(`${params.id}`, listenToSigneesData);
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

    let innerSignees = signees;
    if (!innerSignees?.length) {
      innerSignees = await store.getProofOfUsSignees(proofOfUs.proofOfUsId);
    }

    await store.addSignee(
      proofOfUs,
      innerSignees,
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
    if (!proofOfUs || !account) return;
    if (!isOverwrite && isAlreadySigning(proofOfUs)) return;

    let innerSignees = signees;
    if (!innerSignees?.length) {
      innerSignees = await store.getProofOfUsSignees(proofOfUs.proofOfUsId);
    }

    const signee = innerSignees.find(
      (a) => a.accountName === account.accountName,
    );
    if (!signee) return;

    await store.updateSignee(proofOfUs, { ...signee, ...value });
  };

  const getSignature = async (
    tx: IUnsignedCommand,
  ): Promise<string | undefined> => {
    if (!proofOfUs || !account) return;

    let innerSignees = signees;
    if (!innerSignees?.length) {
      innerSignees = await store.getProofOfUsSignees(proofOfUs.proofOfUsId);
    }

    const idx = innerSignees.findIndex(
      (a) => a.accountName === account.accountName,
    );
    if (idx < 0) return;

    return tx.sigs[idx]?.sig;
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

  const hasSigned = async (): Promise<boolean> => {
    if (!proofOfUs) return false;

    let innerSignees = signees;
    if (!innerSignees?.length) {
      innerSignees = await store.getProofOfUsSignees(proofOfUs.proofOfUsId);
    }

    const signee = innerSignees.find(
      (s) => s.accountName === account?.accountName,
    );

    return !!signee?.signature;
  };

  const isSignee = async (): Promise<boolean> => {
    if (!proofOfUs) return false;

    let innerSignees = signees;
    if (!innerSignees?.length) {
      innerSignees = await store.getProofOfUsSignees(proofOfUs.proofOfUsId);
    }

    const signee = innerSignees.find(
      (s) => s.accountName === account?.accountName,
    );

    return !!signee;
  };

  const isConnected = async () => {
    if (!proofOfUs) return false;

    let innerSignees = signees;
    if (!innerSignees?.length) {
      innerSignees = await store.getProofOfUsSignees(proofOfUs.proofOfUsId);
    }

    return !!innerSignees.find((s) => s.accountName === account?.accountName);
  };

  const isInitiator = async () => {
    if (!proofOfUs) return false;

    let innerSignees = signees;
    if (!innerSignees?.length) {
      innerSignees = await store.getProofOfUsSignees(proofOfUs.proofOfUsId);
    }

    const foundAccount = innerSignees.find(
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
        isSignee,
        getSignature,
      }}
    >
      {children}
    </ProofOfUsContext.Provider>
  );
};
