const ProofOfUsStore = () => {
  const store: Record<string, IProofOfUs> = {};

  const createProofOfUs = (proofOfUsId: string, account: IProofOfUsSignee) => {
    if (store[proofOfUsId]) return;
    store[proofOfUsId] = {
      proofOfUsId,
      type: 'multi',
      date: Date.now(),
      signees: [{ ...account, initiator: true }],
      avatar: {
        background: '',
      },
    };
  };

  const getProofOfUs = (proofOfUsId: string) => {
    return store[proofOfUsId];
  };

  const addBackground = (proofOfUsId: string, background: string) => {
    const avatar = store[proofOfUsId]?.avatar;

    store[proofOfUsId].avatar = { ...avatar, background };
  };

  const addSignee = (proofOfUsId: string, account: IProofOfUsSignee) => {
    const signeesList = store[proofOfUsId]?.signees;
    if (!signeesList) return;

    if (signeesList.find((s) => s.cid === account.cid)) return;

    if (!signeesList.length) {
      store[proofOfUsId].signees[0] = { ...account };
    } else {
      store[proofOfUsId].signees[1] = { ...account, initiator: false };
      store[proofOfUsId].signees.length = 2;
    }

    store[proofOfUsId].signees = [...signeesList];
  };

  const removeSignee = (proofOfUsId: string, account: IProofOfUsSignee) => {
    const signeesList = store[proofOfUsId]?.signees;
    if (!signeesList) return;

    store[proofOfUsId].signees = [
      ...signeesList.filter((s) => s.cid !== account.cid),
    ];
  };

  const closeToken = (proofOfUsId: string) => {
    delete store[proofOfUsId];
  };

  return {
    createProofOfUs,
    getProofOfUs,
    addSignee,
    removeSignee,
    addBackground,
    closeToken,
  };
};

export const store = ProofOfUsStore();
