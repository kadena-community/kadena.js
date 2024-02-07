import { BUILDSTATUS } from '@/constants';
import { isAlreadySigning } from '../isAlreadySigning';

const ProofOfUsStore = () => {
  const store: Record<string, IProofOfUs> = {};

  const createProofOfUs = (proofOfUsId: string, account: IProofOfUsSignee) => {
    if (store[proofOfUsId]) return;
    store[proofOfUsId] = {
      background: '',
      data: {
        status: BUILDSTATUS.INIT,
        mintStatus: 'init',
        proofOfUsId,
        type: 'multi',
        date: Date.now(),
        signees: [{ ...account, signerStatus: 'init', initiator: true }],
      },
    };
  };

  const getProofOfUs = (proofOfUsId: string) => {
    if (!store[proofOfUsId]) return null;
    return store[proofOfUsId].data;
  };

  const addBackground = (
    proofOfUsId: string,
    background: IProofOfUsBackground,
  ) => {
    //check if there are people already signing. it is not possible to set the background
    if (isAlreadySigning(store[proofOfUsId].data.signees)) return;

    store[proofOfUsId].background = background;
  };

  const updateStatus = (proofOfUsId: string, status: IBuildStatusValues) => {
    store[proofOfUsId].data.status = status;
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
  };
};

export const store = ProofOfUsStore();
