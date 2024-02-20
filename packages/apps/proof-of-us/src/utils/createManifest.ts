import { fetchManifestData } from './fetchManifestData';
import { getProofOfUs } from './proofOfUs';

const getEventData = async (
  eventId: string,
): Promise<IProofOfUsTokenMeta | undefined> => {
  const event = await getProofOfUs(eventId);
  if (!event) return;
  const data = await fetchManifestData(event?.uri);

  return data;
};

export const createManifest = async (
  proofOfUs: IProofOfUsData,
  url: string,
) => {
  const signees =
    Object.keys(proofOfUs.signees).map((k: any) => proofOfUs.signees[k]) ?? [];

  const eventData = await getEventData(proofOfUs.eventId);

  return {
    name: proofOfUs.title,
    description: `${proofOfUs.title} was a great event`,
    image: url,
    authors: signees.map((signee) => ({
      name: signee.label ? signee.label : signee.alias,
    })),
    properties: {
      date: proofOfUs.date,
      eventName: eventData?.name,
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
