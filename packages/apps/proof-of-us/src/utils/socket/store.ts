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

    await set(
      ref(database, `proofs/${account.accountName}/${proofOfUsId}`),
      obj,
    );
    await set(ref(database, `data/${proofOfUsId}`), obj);
  };

  const filterProof = (data: IProofOfUsData): boolean => {
    return !!(data.requestKey && data.mintStatus !== 'error');
  };
  const listenToUser = (
    account: IAccount,
    setDataCallback: (proofOfUs: IProofOfUsData[]) => void,
  ) => {
    const proofOfUsRef = ref(database, `/proofs/${account.accountName}`);
    onValue(proofOfUsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setDataCallback([]);
        return;
      }
      const arr = (Object.entries(data).map(([key, value]) => value) ??
        []) as IProofOfUsData[];

      setDataCallback(arr.filter(filterProof));
    });
  };

  const listenProofOfUsData = (
    proofOfUsId: string,
    account: IAccount,
    setDataCallback: (proofOfUs: IProofOfUsData | undefined) => void,
  ) => {
    const proofOfUsRef = ref(
      database,
      `proofs/${account.accountName}/${proofOfUsId}`,
    );
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
    console.log('listen', proofOfUsId);
    const backgroundRef = ref(database, `background/${proofOfUsId}`);
    onValue(backgroundRef, (snapshot) => {
      console.log({ snap: snapshot.val() });
      const data = snapshot.val() ?? { bg: '' };
      setDataCallback(data);
    });

    return () => off(backgroundRef);
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
    console.log('updatestatus', proofOfUs);
    const signees = proofOfUs.signees;

    const newProof = { ...proofOfUs, status };
    const promises = signees.map((s) => {
      return update(
        ref(database, `proofs/${s.accountName}/${proofOfUs.proofOfUsId}`),
        newProof,
      );
    });
    promises.push(
      update(ref(database, `data/${proofOfUs.proofOfUsId}`), {
        status,
      }),
    );

    return await Promise.allSettled(promises);
  };

  const addSignee = async (
    proofOfUs: IProofOfUsData,
    account: IProofOfUsSignee,
  ) => {
    console.log('addsignee', proofOfUs);
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

    const newProof = { ...proofOfUs, signees: signeesList };

    const promises = signeesList.map((s) => {
      return update(
        ref(database, `proofs/${s.accountName}/${proofOfUs.proofOfUsId}`),
        newProof,
      );
    });

    promises.push(
      update(ref(database, `data/${proofOfUs.proofOfUsId}`), {
        signees: signeesList,
      }),
    );

    return await Promise.allSettled(promises);
  };

  const removeSignee = async (
    proofOfUs: IProofOfUsData,
    account: IProofOfUsSignee,
  ) => {
    console.log('removesignee', proofOfUs);
    const signeesList = proofOfUs.signees;
    if (!signeesList) return;

    const signees = signeesList.filter(
      (s) => s.accountName !== account.accountName,
    );

    const newProof = { ...proofOfUs, signees: signees };

    const promises = signees.map((s) => {
      return update(
        ref(database, `proofs/${s.accountName}/${proofOfUs.proofOfUsId}`),
        newProof,
      );
    });

    promises.push(
      update(ref(database, `data/${proofOfUs.proofOfUsId}`), {
        signees: signees,
      }),
    );

    return await Promise.allSettled(promises);
  };

  const closeToken = async (proofOfUsId: string, proofOfUs: IProofOfUsData) => {
    const signees = proofOfUs.signees;
    const promises = signees.map((s) => {
      return set(ref(database, `proofs/${s.accountName}/${proofOfUsId}`), null);
    });
    promises.push(set(ref(database, `data/${proofOfUsId}`), null));

    return await Promise.allSettled(promises);
  };

  const updateMintStatus = async (
    proofOfUs: IProofOfUsData,
    mintStatus: IMintStatus,
  ) => {
    console.log('updatemint', proofOfUs);
    const signees = proofOfUs.signees;
    const newProof = { ...proofOfUs, signees: signees };

    const promises = signees.map((s) => {
      return update(
        ref(database, `proofs/${s.accountName}/${proofOfUs.proofOfUsId}`),
        newProof,
      );
    });
    promises.push(
      update(ref(database, `data/${proofOfUs.proofOfUsId}`), {
        mintStatus,
      }),
    );

    return await Promise.allSettled(promises);
  };

  const updateProofOfUs = async (proofOfUs: IProofOfUsData, value: any) => {
    const newProof = { ...proofOfUs, ...value };

    console.log('updateproof', value, newProof);

    const signees = newProof.signees;

    const promises = signees.map((s: IProofOfUsSignee) => {
      return update(
        ref(database, `proofs/${s.accountName}/${newProof.proofOfUsId}`),
        newProof,
      );
    });

    promises.push(
      update(ref(database, `data/${newProof.proofOfUsId}`), newProof),
    );

    return await Promise.allSettled(promises);
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
    listenToUser,
    listenProofOfUsData,
    listenProofOfUsBackgroundData,
    listenLeaderboard,
    updateProofOfUs,
    saveAlias,
    getAllAccounts,
    saveLeaderboardAccounts,
  };
};

export const store = ProofOfUsStore();
