export const getManifest = (proofOfUs: IProofOfUsData, url: string): {} => {
  const signees =
    Object.keys(proofOfUs.signees).map((k: any) => proofOfUs.signees[k]) ?? [];
  return {
    name: 'My NFT',
    description: 'This is my non-fungible token.',
    image: url,
    authors: signees.map((signee) => ({
      name: signee.label ? signee.label : signee.displayName,
    })),
    properties: {
      avatar: {
        backgroundColor: proofOfUs.backgroundColor,
      },
      signees: signees.map((signee) => ({
        name: signee.label ? signee.label : signee.displayName,
        position: {
          xPercentage: signee.position?.xPercentage,
          yPercentage: signee.position?.yPercentage,
        },
        socialLinks: signee.socialLinks?.map((link) => link),
      })),
    },
    collection: {
      name: 'Proof Of Us',
      family: 'Art',
    },
  };
};
