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
  };
}

export const createImageUrl = async (
  bg: string,
  proofOfUsId: string,
): Promise<INFTUrl | undefined> => {
  const mimeType = bg.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/)?.[1];

  if (!mimeType) {
    return;
  }

  const res = await fetch('/api/uploadimage', {
    method: 'POST',
    body: JSON.stringify({ proofOfUsId }),
  });
  const imageData = await res.json();

  if (!imageData?.url) {
    return;
  }

  return {
    url: imageData.url,
    data: {
      cid: imageData.cid,
    },
  };
};

export const createMetaDataUrl = async (
  manifest: any,
  proofOfUsId: string,
): Promise<INFTUrl | undefined> => {
  const res = await fetch('/api/uploadmeta', {
    method: 'POST',
    body: JSON.stringify({ proofOfUsId, manifest }),
  });
  const metadata = await res.json();

  if (!metadata?.url) {
    return;
  }

  return {
    url: metadata.url,
    data: {
      cid: metadata.cid,
    },
  };

  // const metadataFileName = 'metadata';
  // const metadata = await NFTStorage.encodeDirectory([
  //   new File([JSON.stringify(manifest, null, 2)], metadataFileName),
  // ]);

  // const metadataUrl = uri
  //   ? uri
  //   : `https://${metadata.cid.toString()}.ipfs.nftstorage.link/${metadataFileName}`;

  // console.log('metadata cid', metadata.cid.toString());
  // console.log('metadata url', metadataUrl);

  // return { data: metadata, url: metadataUrl };
};
