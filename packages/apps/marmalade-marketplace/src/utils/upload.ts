import type { CarReader } from 'nft.storage';
import { Blob, File, NFTStorage } from 'nft.storage';
import type { CID } from 'nft.storage/dist/src/lib/interface';

export const createFileFromBlob = (blob: Blob, fileName: string) => {
  return new File([blob], fileName, { type: blob.type });
};

export const base64ToBlob = (base64: string, mimeType: string) => {
  const bytes = atob(base64.split(',')[1]);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    arr[i] = bytes.charCodeAt(i);
  }
  return new Blob([arr], { type: mimeType });
};

interface INFTUrl {
  url: string;
  data: {
    cid: CID;
    car: CarReader;
  };
}

export const createImageUrl = async (
  bg: string,
  uri?: string,
): Promise<INFTUrl | undefined> => {
  const mimeType = bg.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1];

  if (!mimeType) {
    return;
  }

  const blob = base64ToBlob(bg, mimeType);
  const imageFileName = 'image';

  const image = await NFTStorage.encodeDirectory([
    createFileFromBlob(blob, imageFileName),
  ]);
  const imageUrl = uri
    ? uri
    : `https://${image.cid.toString()}.ipfs.nftstorage.link/${imageFileName}`;

  console.log('image cid', image.cid.toString());
  console.log('image url', imageUrl);

  return { url: imageUrl, data: image };
};

export const createMetaDataUrl = async (
  manifest: any,
  uri?: string,
): Promise<INFTUrl | undefined> => {
  const metadataFileName = 'metadata';
  const metadata = await NFTStorage.encodeDirectory([
    new File([JSON.stringify(manifest, null, 2)], metadataFileName),
  ]);

  const metadataUrl = uri
    ? uri
    : `https://${metadata.cid.toString()}.ipfs.nftstorage.link/${metadataFileName}`;

  console.log('metadata cid', metadata.cid.toString());
  console.log('metadata url', metadataUrl);

  return { data: metadata, url: metadataUrl };
};

