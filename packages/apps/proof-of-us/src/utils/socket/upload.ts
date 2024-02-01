import type { Akord } from '@akord/akord-js';
import { NodeJs } from '@akord/akord-js/lib/types/file';
import { Readable } from 'stream';

const AKORD_VAULTID = process.env.AKORD_VAULTID;

const getManifest = (proofOfUs: IProofOfUs, urlId: string): {} => {
  return {
    name: 'My NFT',
    description: 'This is my non-fungible token.',
    image: `https://arweave.net/${urlId}`,
    authors: proofOfUs.signees.map((signee) => ({ name: signee.displayName })),
    collection: {
      name: 'Proof Of Us',
      family: 'Art',
    },
  };
};

export const upload = async (
  akord: Akord,
  str: string,
  tokenId: string,
  proofOfUs: IProofOfUs,
): Promise<Record<string, any> | IError> => {
  const base64Image = str.split(';base64,').pop();
  if (!AKORD_VAULTID)
    return {
      status: 500,
      message: 'AKORD_VAULTID is missing',
    };
  if (!base64Image)
    return {
      status: 500,
      message: 'no correct image given',
    };

  const fileBuffer = Buffer.from(base64Image, 'base64');
  const fileStream = Readable.from(fileBuffer);

  const file = await NodeJs.File.fromReadable(fileStream, tokenId, 'png');
  try {
    //image
    const result = await akord.stack.create(
      AKORD_VAULTID,
      file,
      `${tokenId}.png`,
    );

    const url = await akord.stack.getUri(result.stackId);
    //manifest
    const json = getManifest(proofOfUs, url);
    const manifestBuffer = Buffer.from(JSON.stringify(json));
    const manifestStream = Readable.from(manifestBuffer);
    const manifestfile = await NodeJs.File.fromReadable(
      manifestStream,
      tokenId,
      'json',
    );

    const manifestresult = await akord.stack.create(
      AKORD_VAULTID,
      manifestfile,
      `manifest_${tokenId}.json`,
    );

    return { result, url, manifestresult };
  } catch (e) {
    return {
      status: e.statusCode,
      message: e.message,
    };
  }
};
