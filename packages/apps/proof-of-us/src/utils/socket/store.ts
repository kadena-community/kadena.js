const ProofOfUsStore = () => {
  const store: Record<string, IProofOfUs> = {};

  const createProofOfUs = (proofOfUsId: string, account: IProofOfUsSignee) => {
    if (store[proofOfUsId]) return;
    store[proofOfUsId] = {
      background: '',
      data: {
        mintStatus: 'init',
        proofOfUsId,
        type: 'multi',
        date: Date.now(),
        signees: [{ ...account, initiator: true }],
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
    store[proofOfUsId].background = background;
  };

  const getBackground = (proofOfUsId: string) => {
    return store[proofOfUsId].background;
  };

  const addSignee = (proofOfUsId: string, account: IProofOfUsSignee) => {
    const signeesList = store[proofOfUsId]?.data.signees;
    if (!signeesList) return;

    if (signeesList.find((s) => s.cid === account.cid)) return;

    if (!signeesList.length) {
      store[proofOfUsId].data.signees[0] = { ...account };
    } else {
      store[proofOfUsId].data.signees[1] = { ...account, initiator: false };
      store[proofOfUsId].data.signees.length = 2;
    }

    store[proofOfUsId].data.signees = [...signeesList];
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
    removeSignee,
    addBackground,
    closeToken,
  };
};

export const store = ProofOfUsStore();
