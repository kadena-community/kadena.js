export const getManifest = (proofOfUs: IProofOfUsData, url: string): {} => {
  const signees =
    Object.keys(proofOfUs.signees).map((k: any) => proofOfUs.signees[k]) ?? [];
  return {
    name: 'My NFT',
    description: 'This is my non-fungible token.',
    image: url,
    authors: signees.map((signee) => ({ name: signee.displayName })),
    collection: {
      name: 'Proof Of Us',
      family: 'Art',
    },
  };
};
