import { getManifest } from '@/utils/getManifest';
import { store } from '@/utils/socket/store';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Blob, File, NFTStorage } from 'nft.storage';

interface IResponseData {
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseData>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      message: 'method not allowed',
    });
  }

  const body = JSON.parse(req.body);
  const proofOfUsId = body.proofOfUsId;

  const background = await store.getBackground(proofOfUsId);
  const proofOfUs = await store.getProofOfUs(proofOfUsId);

  if (!background?.bg) {
    return res.status(404).json({
      message: 'background not found',
    });
  }
  if (!proofOfUs) {
    return res.status(404).json({
      message: 'proofOfUs not found',
    });
  }

  if (!process.env.NFTSTORAGE_API_TOKEN) {
    return res.status(500).json({
      message: 'api token not found',
    });
  }

  const client = new NFTStorage({ token: process.env.NFTSTORAGE_API_TOKEN });

  const mimeType = background?.bg.match(
    /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/,
  )?.[1];

  if (!mimeType) {
    return res.status(500).json({
      message: 'invalid meme type',
    });
  }

  const blob = base64ToBlob(background?.bg, mimeType);
  const imageFileName = 'image';

  const image = await NFTStorage.encodeDirectory([
    createFileFromBlob(blob, imageFileName),
  ]);
  const imageUrl = `https://${image.cid.toString()}.ipfs.nftstorage.link/${imageFileName}`;

  console.log('image cid', image.cid.toString());
  console.log('image url', imageUrl);

  const manifest = getManifest(proofOfUs, imageUrl);

  const metadataFileName = 'metadata';
  const metadata = await NFTStorage.encodeDirectory([
    new File([JSON.stringify(manifest, null, 2)], metadataFileName),
  ]);

  const metadataUrl = `https://${metadata.cid.toString()}.ipfs.nftstorage.link/${metadataFileName}`;

  console.log('metadata cid', metadata.cid.toString());
  console.log('metadata url', metadataUrl);

  const results = await Promise.allSettled([
    client.storeCar(image.car),
    client.storeCar(metadata.car),
  ]);

  const failed = results.filter((result) => result.status === 'rejected');

  if (failed.length) {
    console.log('Error uploading data to IPFS', failed);

    return res.status(500).json({
      message: 'Error uploading data to IPFS',
    });
  }

  res.status(200).json({
    message: JSON.stringify(
      {
        imageCid: image.cid.toString(),
        imageUrl,
        metadataCid: metadata.cid.toString(),
        metadataUrl,
      },
      null,
      2,
    ),
  });
}

function base64ToBlob(base64: string, mimeType: string) {
  const bytes = atob(base64.split(',')[1]);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    arr[i] = bytes.charCodeAt(i);
  }
  return new Blob([arr], { type: mimeType });
}

function createFileFromBlob(blob: Blob, fileName: string) {
  return new File([blob], fileName, { type: blob.type });
}
