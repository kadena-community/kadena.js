import { BUILDSTATUS } from '@/constants';
import { child, get, off, onValue, ref, set, update } from 'firebase/database';
import type { Dispatch, SetStateAction } from 'react';
import { database, dbRef } from '../firebase';
import { isAlreadySigning } from '../isAlreadySigning';

const convertObjectToArray = (
  obj?: Record<string, IProofOfUsSignee>,
): IProofOfUsSignee[] => {
  if (!obj) return [];

  if (!Array.isArray(obj)) {
    const newArray = Object.entries(obj).map(([key, value]) => value);

    const initiator = newArray.find((a) => a.initiator);
    const restArray = newArray
      .filter((a) => !a.initiator)
      .sort((a, b) => {
        if (a.accountName < b.accountName) return -1;
        if (a.accountName > b.accountName) return 1;
        return 0;
      });

    return initiator ? [initiator, ...restArray] : [...restArray];
  }

  return [];
};

const ProofOfUsStore = () => {
  const getProofOfUs = async (
    proofOfUsId: string,
  ): Promise<IProofOfUsData | null> => {
    const docRef = await get(child(dbRef, `data/${proofOfUsId}`));

    if (!docRef.exists()) return null;
    return docRef.toJSON() as IProofOfUsData;
  };
  const getProofOfUsSignees = async (
    proofOfUsId: string,
  ): Promise<IProofOfUsSignee[]> => {
    const docRef = await get(child(dbRef, `signees/${proofOfUsId}`));

    if (!docRef.exists()) return [];

    const data = convertObjectToArray(
      docRef.toJSON() as Record<string, IProofOfUsSignee>,
    );
    return data;
  };
  const getBackground = async (
    proofOfUsId: string,
  ): Promise<IProofOfUsBackground | null> => {
    const docRef = await get(child(dbRef, `background/${proofOfUsId}`));

    if (!docRef.exists()) return { bg: '' };
    const data = docRef.toJSON();
    return (data ?? { bg: '' }) as IProofOfUsBackground;
  };

  const createProofOfUs = async (
    proofOfUsId: string,
    account: IProofOfUsSignee,
  ) => {
    const proofOfUs = await getProofOfUs(proofOfUsId);
    if (proofOfUs) return;

    const obj = {
      status: BUILDSTATUS.INIT,
      mintStatus: 'init',
      proofOfUsId,
      isReadyToSign: false,
      eventId: process.env.NEXT_PUBLIC_CONNECTION_EVENTID,
      type: 'connect',
      date: Date.now(),
    };

    await set(ref(database, `signees/${proofOfUsId}/${account.accountName}`), {
      ...account,
      signerStatus: 'init',
      initiator: true,
    });
    await set(ref(database, `data/${proofOfUsId}`), obj);
  };

  const listenProofOfUsData = (
    proofOfUsId: string,
    account: IAccount,
    setDataCallback: (proofOfUs: IProofOfUsData | undefined) => void,
  ) => {
    const proofOfUsRef = ref(database, `data/${proofOfUsId}`);
    onValue(proofOfUsRef, (snapshot) => {
      const data = snapshot.val();
      setDataCallback(data);
    });

    return () => off(proofOfUsRef);
  };

  const listenProofOfUsBackgroundData = (
    proofOfUsId: string,
    setDataCallback: Dispatch<SetStateAction<IProofOfUsBackground>>,
  ) => {
    const backgroundRef = ref(database, `background/${proofOfUsId}`);
    onValue(backgroundRef, (snapshot) => {
      const data = snapshot.val() ?? { bg: '' };
      setDataCallback(data);
    });

    return () => off(backgroundRef);
  };

  const listenProofOfUsSigneesData = (
    proofOfUsId: string,
    setDataCallback: (data: IProofOfUsSignee[]) => void,
  ) => {
    const signeesRef = ref(database, `signees/${proofOfUsId}`);
    onValue(signeesRef, (snapshot) => {
      const data = convertObjectToArray(snapshot.val());

      setDataCallback(data);
    });

    return () => off(signeesRef);
  };

  const listenLeaderboard = (
    setDataCallback: Dispatch<SetStateAction<IAccountLeaderboard[]>>,
  ) => {
    const accountsRef = ref(database, `accounts`);
    onValue(accountsRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) return [];

      const getAccountName = (str: string) =>
        `${str.substring(0, 6)}...${str.substring(str.length - 4)}`;

      const dataArray = Object.entries(
        data as Record<string, IAccountLeaderboard>,
      )
        .map(([key, value]) => ({
          accountName: getAccountName(value.accountName),
          alias: value.alias,
          tokenCount: value.tokenCount || 0,
        }))
        .sort((a, b) => (a.tokenCount < b.tokenCount ? 1 : -1));
      setDataCallback(dataArray);
    });
  };

  const addBackground = async (
    proofOfUs: IProofOfUsData,
    background: IProofOfUsBackground,
  ) => {
    //check if there are people already signing. it is not possible to set the background
    if (isAlreadySigning(proofOfUs)) return;
    await set(ref(database, `background/${proofOfUs.proofOfUsId}`), background);
  };

  const removeBackground = async (proofOfUs: IProofOfUsData) => {
    //check if there are people already signing. it is not possible to set the background
    if (isAlreadySigning(proofOfUs)) return;
    await set(ref(database, `background/${proofOfUs.proofOfUsId}`), null);
  };

  const updateStatus = async (
    proofOfUsId: string,
    proofOfUs: IProofOfUsData,
    status: IBuildStatusValues,
  ) => {
    return await update(ref(database, `data/${proofOfUs.proofOfUsId}`), {
      status,
    });
  };

  const addSignee = async (
    proofOfUs: IProofOfUsData,
    signees: IProofOfUsSignee[],
    account: IProofOfUsSignee,
  ) => {
    if (signees.find((s) => s.accountName === account.accountName)) return;

    const signee: IProofOfUsSignee = {
      ...account,
      signerStatus: !account.signerStatus ? 'signing' : account.signerStatus,
      initiator: false,
    };

    return await update(
      ref(database, `signees/${proofOfUs.proofOfUsId}/${account.accountName}`),
      signee,
    );
  };

  const removeSignee = async (
    proofOfUs: IProofOfUsData,
    account: IProofOfUsSignee,
  ) => {
    return await set(
      ref(database, `signees/${proofOfUs.proofOfUsId}/${account.accountName}`),
      null,
    );
  };

  const updateSignee = async (
    proofOfUs: IProofOfUsData,
    account: IProofOfUsSignee,
  ) => {
    return await set(
      ref(database, `signees/${proofOfUs.proofOfUsId}/${account.accountName}`),
      account,
    );
  };

  const closeToken = async (proofOfUsId: string, proofOfUs: IProofOfUsData) => {
    await set(ref(database, `signees/${proofOfUsId}`), null);
    return await set(ref(database, `data/${proofOfUsId}`), null);
  };

  const updateMintStatus = async (
    proofOfUs: IProofOfUsData,
    mintStatus: IMintStatus,
  ) => {
    return await update(ref(database, `data/${proofOfUs.proofOfUsId}`), {
      mintStatus,
    });
  };

  const updateProofOfUs = async (proofOfUs: IProofOfUsData, value: any) => {
    const newProof = { ...proofOfUs, ...value };

    return await update(
      ref(database, `data/${newProof.proofOfUsId}`),
      newProof,
    );
  };

  const getAllAccounts = async (): Promise<IAccountLeaderboard[] | null> => {
    const docRef = await get(child(dbRef, `accounts`));

    if (!docRef.exists()) return [];
    const data = docRef.toJSON();
    if (!data) return [];
    const newData = Object.entries(data).map(([key, value]) => value);
    return (newData ?? []) as IAccountLeaderboard[];
  };

  const saveAlias = async (account: IAccount | undefined) => {
    if (!account) return;
    const accData = { alias: account.alias, accountName: account.accountName };

    await update(ref(database, `accounts/${account.accountName}`), accData);
  };
  const saveLeaderboardAccounts = async (accounts: IAccountLeaderboard[]) => {
    const obj = accounts.reduce(
      (acc: Record<string, IAccountLeaderboard>, val: IAccountLeaderboard) => {
        acc[val.accountName] = val;
        return acc;
      },
      {},
    );
    await update(ref(database, `accounts`), obj);
  };

  return {
    updateMintStatus,
    createProofOfUs,
    getProofOfUs,
    getBackground,
    getProofOfUsSignees,
    addSignee,
    removeSignee,
    updateSignee,
    addBackground,
    removeBackground,
    closeToken,
    updateStatus,
    listenProofOfUsData,
    listenProofOfUsBackgroundData,
    listenProofOfUsSigneesData,
    updateProofOfUs,
    saveAlias,
    getAllAccounts,
    saveLeaderboardAccounts,
    listenLeaderboard,
  };
};

export const store = ProofOfUsStore();
