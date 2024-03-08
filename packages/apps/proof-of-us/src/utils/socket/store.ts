import { BUILDSTATUS } from '@/constants';
import { child, get, off, onValue, ref, set, update } from 'firebase/database';
import type { Dispatch, SetStateAction } from 'react';
import { database, dbRef } from '../firebase';
import { isAlreadySigning } from '../isAlreadySigning';

const ProofOfUsStore = () => {
  const getProofOfUs = async (
    proofOfUsId: string,
  ): Promise<IProofOfUsData | null> => {
    const docRef = await get(child(dbRef, `data/${proofOfUsId}`));

    if (!docRef.exists()) return null;
    return docRef.toJSON() as IProofOfUsData;
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
      eventId: process.env.NEXT_PUBLIC_CONNECTION_EVENTID,
      type: 'connect',
      date: Date.now(),
      signees: [{ ...account, signerStatus: 'init', initiator: true }],
    };

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

  const addBackground = async (
    proofOfUs: IProofOfUsData,
    background: IProofOfUsBackground,
  ) => {
    //check if there are people already signing. it is not possible to set the background
    if (isAlreadySigning(proofOfUs.signees)) return;
    await set(ref(database, `background/${proofOfUs.proofOfUsId}`), background);
  };

  const removeBackground = async (proofOfUs: IProofOfUsData) => {
    //check if there are people already signing. it is not possible to set the background
    if (isAlreadySigning(proofOfUs.signees)) return;
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
    account: IProofOfUsSignee,
  ) => {
    const signeesList = [...proofOfUs.signees];
    if (!signeesList) return;

    if (signeesList.find((s) => s.accountName === account.accountName)) return;

    if (!signeesList.length) {
      signeesList[0] = {
        ...account,
        signerStatus: !account.signerStatus ? 'signing' : account.signerStatus,
      };
    } else {
      signeesList[1] = {
        ...account,
        signerStatus: !account.signerStatus ? 'signing' : account.signerStatus,
        initiator: !account.initiator ? false : account.initiator,
      };

      signeesList.length = 2;
    }

    return await update(ref(database, `data/${proofOfUs.proofOfUsId}`), {
      signees: signeesList,
    });
  };

  const removeSignee = async (
    proofOfUs: IProofOfUsData,
    account: IProofOfUsSignee,
  ) => {
    const signeesList = proofOfUs.signees;
    if (!signeesList) return;

    const signees = signeesList.filter(
      (s) => s.accountName !== account.accountName,
    );

    return await update(ref(database, `data/${proofOfUs.proofOfUsId}`), {
      signees: signees,
    });
  };

  const closeToken = async (proofOfUsId: string, proofOfUs: IProofOfUsData) => {
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
    addSignee,
    removeSignee,
    addBackground,
    removeBackground,
    closeToken,
    updateStatus,
    listenProofOfUsData,
    listenProofOfUsBackgroundData,
    updateProofOfUs,
    saveAlias,
    getAllAccounts,
    saveLeaderboardAccounts,
  };
};

export const store = ProofOfUsStore();
