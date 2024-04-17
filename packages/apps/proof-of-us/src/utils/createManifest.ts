// import { fetchManifestData } from './fetchManifestData';
// import { getProofOfUs } from './proofOfUs';

// const getEventData = async (
//   eventId: string,
// ): Promise<IProofOfUsTokenMeta | undefined> => {
//   const event = await getProofOfUs(eventId);
//   if (!event) return;
//   const data = await fetchManifestData(event?.uri);
//   return data;
// };

export const createManifest = async (
  proofOfUs: IProofOfUsData,
  signees: IProofOfUsSignee[],
  url: string,
): Promise<IProofOfUsTokenMeta> => {
  //const eventData = await getEventData(proofOfUs.eventId);

  return {
    name: proofOfUs.title ?? '',
    description: `${proofOfUs.title} was a great event`,
    image: url,
    authors: signees.map((signee) => ({
      name: signee.name ? signee.name : signee.alias,
    })),
    properties: {
      date: proofOfUs.date,
      eventType: proofOfUs.type,
      avatar: {
        backgroundColor: proofOfUs.backgroundColor ?? '',
      },
      signees:
        signees?.map((signee) => {
          return {
            name: signee.name ? signee.name : signee.alias,
            accountName: signee.accountName,
            position: {
              xPercentage: signee.position?.xPercentage,
              yPercentage: signee.position?.yPercentage,
            },
            socialLink: signee.socialLink,
          } as IProofOfUsTokenSignee;
        }) ?? [],
    },
    collection: {
      name: 'Proof Of Us',
      family: 'Art',
    },
  };
};
