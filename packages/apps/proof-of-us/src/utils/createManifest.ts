export const createManifest = (proofOfUs: IProofOfUsData, url: string): {} => {
  const signees =
    Object.keys(proofOfUs.signees).map((k: any) => proofOfUs.signees[k]) ?? [];

  return {
    name: proofOfUs.title,
    description: `${proofOfUs.title} was a great event`,
    image: url,
    authors: signees.map((signee) => ({
      name: signee.label ? signee.label : signee.alias,
    })),
    properties: {
      date: proofOfUs.date * 1000,
      eventId: proofOfUs.eventId,
      eventType: proofOfUs.type,
      avatar: {
        backgroundColor: proofOfUs.backgroundColor,
      },
      signees: signees?.map((signee) => ({
        name: signee.label ? signee.label : signee.alias,
        position: {
          xPercentage: signee.position?.xPercentage,
          yPercentage: signee.position?.yPercentage,
        },
        socialLinks: signee?.socialLinks?.map((link: string) => link),
      })),
    },
    collection: {
      name: 'Proof Of Us',
      family: 'Art',
    },
  };
};
