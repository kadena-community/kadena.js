const ProofOfUsStore = () => {
  const store: Record<string, IProofOfUs> = {};

  const createProofOfUs = (tokenId: string, account: IProofOfUsSignee) => {
    if (store[tokenId]) return;
    store[tokenId] = {
      tokenId,
      type: 'multi',
      date: Date.now(),
      signees: [{ ...account, initiator: true }],
      avatar: {
        background: '',
      },
    };
  };

  const getProofOfUs = (tokenId: string) => {
    return store[tokenId];
  };

  const addBackground = (tokenId: string, background: string) => {
    const avatar = store[tokenId]?.avatar;

    store[tokenId].avatar = { ...avatar, background };
  };

  const addSignee = (tokenId: string, account: IProofOfUsSignee) => {
    const signeesList = store[tokenId]?.signees;
    if (!signeesList) return;

    if (signeesList.find((s) => s.cid === account.cid)) return;

    if (!signeesList.length) {
      store[tokenId].signees[0] = { ...account };
    } else {
      store[tokenId].signees[1] = { ...account, initiator: false };
      store[tokenId].signees.length = 2;
    }

    store[tokenId].signees = [...signeesList];
  };

  const removeSignee = (tokenId: string, account: IProofOfUsSignee) => {
    const signeesList = store[tokenId]?.signees;
    if (!signeesList) return;

    store[tokenId].signees = [
      ...signeesList.filter((s) => s.cid !== account.cid),
    ];
  };

  return {
    createProofOfUs,
    getProofOfUs,
    addSignee,
    removeSignee,
    addBackground,
  };
};

export const store = ProofOfUsStore();
