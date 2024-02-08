import { BUILDSTATUS } from '@/constants';
import { child, get, onValue, ref, set } from 'firebase/database';
import { Dispatch, SetStateAction } from 'react';
import { database, dbRef } from '../firebase';
import { isAlreadySigning } from '../isAlreadySigning';

const ProofOfUsStore = () => {
  const store: Record<string, IProofOfUs> = {};

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

  const getProofOfUs = async (
    proofOfUsId: string,
  ): Promise<IProofOfUsData | null> => {
    const docRef = await get(child(dbRef, `data/${proofOfUsId}`));

    if (!docRef.exists()) return null;
    return docRef.toJSON() as IProofOfUsData;
  };

  const listenProofOfUsData = (
    proofOfUsId: string,
    setDataCallback: Dispatch<SetStateAction<IProofOfUsData | undefined>>,
  ) => {
    const proofOfUsRef = ref(database, `data/${proofOfUsId}`);
    onValue(proofOfUsRef, (snapshot) => {
      const data = snapshot.val();
      console.log('DATA', data);
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
      console.log('DATA', data);
      setDataCallback(data.background);
    });
  };

  const addBackground = async (
    proofOfUs: IProofOfUsData,
    background: IProofOfUsBackground,
  ) => {
    //check if there are people already signing. it is not possible to set the background
    //TODO FIX THIS CHECK
    if (isAlreadySigning(proofOfUs.signees)) return;
    await set(ref(database, `background/${proofOfUs.proofOfUsId}`), {
      background,
    });
  };

  const updateStatus = async (
    proofOfUsId: string,
    status: IBuildStatusValues,
  ) => {
    await set(ref(database, `data/${proofOfUsId}./status`), status);
  };

  const getBackground = (proofOfUsId: string) => {
    return store[proofOfUsId]?.background;
  };

  const addSignee = (proofOfUsId: string, account: IProofOfUsSignee) => {
    const signeesList = store[proofOfUsId].data.signees;
    if (!signeesList) return;

    if (signeesList.find((s) => s.cid === account.cid)) return;

    if (!signeesList.length) {
      store[proofOfUsId].data.signees[0] = {
        ...account,
        signerStatus: !account.signerStatus ? 'signing' : account.signerStatus,
      };
    } else {
      store[proofOfUsId].data.signees[1] = {
        ...account,
        signerStatus: !account.signerStatus ? 'signing' : account.signerStatus,
        initiator: !account.initiator ? false : account.initiator,
      };
      store[proofOfUsId].data.signees.length = 2;
    }

    store[proofOfUsId].data.signees = [...signeesList];
  };
  const updateSignee = (proofOfUsId: string, account: IProofOfUsSignee) => {
    const signeesList = store[proofOfUsId].data.signees;
    if (!signeesList) return;

    const newList = signeesList.map((s, idx) => {
      if (s.cid === account.cid) {
        return { ...s, signerStatus: account.signerStatus };
      }
      return s;
    });

    store[proofOfUsId].data.signees = [...newList];
  };

  const removeSignee = (proofOfUsId: string, account: IProofOfUsSignee) => {
    const signeesList = store[proofOfUsId]?.data.signees;
    if (!signeesList) return;

    store[proofOfUsId].data.signees = [
      ...signeesList.filter((s) => s.cid !== account.cid),
    ];
  };

  const closeToken = (proofOfUsId: string) => {
    delete store[proofOfUsId];
  };

  const updateMintStatus = (proofOfUsId: string, mintStatus: IMintStatus) => {
    store[proofOfUsId].data.mintStatus = mintStatus;
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
