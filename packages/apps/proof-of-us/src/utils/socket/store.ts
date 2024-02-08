import { BUILDSTATUS } from '@/constants';
import { child, get, onValue, ref, set, update } from 'firebase/database';
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
  ): Promise<IProofOfUsData | null> => {
    const docRef = await get(child(dbRef, `background/${proofOfUsId}`));

    if (!docRef.exists()) return null;
    return docRef.toJSON() as IProofOfUsData;
  };

  const createProofOfUs = async (
    proofOfUsId: string,
    account: IProofOfUsSignee,
  ) => {
    const proofOfUs = await getProofOfUs(proofOfUsId);
    if (proofOfUs) return;

    await set(ref(database, `data/${proofOfUsId}`), {
      status: BUILDSTATUS.INIT,
      mintStatus: 'init',
      proofOfUsId,
      type: 'multi',
      date: Date.now(),
      signees: [{ ...account, signerStatus: 'init', initiator: true }],
    });
  };

  const listenProofOfUsData = (
    proofOfUsId: string,
    setDataCallback: Dispatch<SetStateAction<IProofOfUsData | undefined>>,
  ) => {
    const proofOfUsRef = ref(database, `data/${proofOfUsId}`);
    onValue(proofOfUsRef, (snapshot) => {
      const data = snapshot.val();
      setDataCallback(data);
    });
  };

  const listenProofOfUsBackgroundData = (
    proofOfUsId: string,
    setDataCallback: Dispatch<SetStateAction<IProofOfUsBackground>>,
  ) => {
    const backgroundRef = ref(database, `background/${proofOfUsId}`);
    onValue(backgroundRef, (snapshot) => {
      const data = snapshot.val();
      setDataCallback(data?.background);
    });
  };

  const addBackground = async (
    proofOfUs: IProofOfUsData,
    background: IProofOfUsBackground,
  ) => {
    //check if there are people already signing. it is not possible to set the background
    if (isAlreadySigning(proofOfUs.signees)) return;
    await set(ref(database, `background/${proofOfUs.proofOfUsId}`), {
      background,
    });
  };

  const updateStatus = async (
    proofOfUsId: string,
    status: IBuildStatusValues,
  ) => {
    await update(ref(database, `data/${proofOfUsId}`), { status });
  };

  const addSignee = async (
    proofOfUs: IProofOfUsData,
    account: IProofOfUsSignee,
  ) => {
    const signeesList = [...proofOfUs.signees];
    if (!signeesList) return;

    if (signeesList.find((s) => s.cid === account.cid)) return;

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

    await update(ref(database, `data/${proofOfUs.proofOfUsId}`), {
      signees: signeesList,
    });
  };
  const updateSignee = async (
    proofOfUsId: string,
    account: IProofOfUsSignee,
    signerStatus: ISignerStatus,
  ) => {
    const proofOfUs = await getProofOfUs(proofOfUsId);
    if (!proofOfUs) return;

    const signeesList = Object.keys(proofOfUs.signees).map(
      (k: any) => proofOfUs.signees[k],
    );
    if (!signeesList) return;
    if (!signeesList.find((s) => s.cid === account.cid)) {
      signeesList[1] = account;
    }

    const newList = signeesList.map((s) => {
      if (s.cid === account.cid) {
        return { ...account, signerStatus };
      }
      return s;
    });

    console.log({ newList });

    await update(ref(database, `data/${proofOfUs.proofOfUsId}`), {
      signees: newList,
    });
  };

  const removeSignee = async (
    proofOfUs: IProofOfUsData,
    account: IProofOfUsSignee,
  ) => {
    const signeesList = proofOfUs.signees;
    if (!signeesList) return;

    await update(ref(database, `data/${proofOfUs.proofOfUsId}`), {
      signees: signeesList.filter((s) => s.cid !== account.cid),
    });
  };

  const closeToken = async (proofOfUsId: string) => {
    await set(ref(database, `data/${proofOfUsId}`), null);
  };

  const updateMintStatus = async (
    proofOfUs: IProofOfUsData,
    mintStatus: IMintStatus,
  ) => {
    await update(ref(database, `data/${proofOfUs.proofOfUsId}`), {
      mintStatus,
    });
  };

  return {
    updateMintStatus,
    createProofOfUs,
    getProofOfUs,
    getBackground,
    addSignee,
    updateSignee,
    removeSignee,
    addBackground,
    closeToken,
    updateStatus,
    listenProofOfUsData,
    listenProofOfUsBackgroundData,
  };
};

export const store = ProofOfUsStore();
