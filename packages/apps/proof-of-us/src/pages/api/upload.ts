import { createManifest } from '@/utils/createManifest';
import { store } from '@/utils/socket/store';
import { createImageUrl, createMetaDataUrl } from '@/utils/upload';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NFTStorage } from 'nft.storage';

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

  const imageData = await createImageUrl(background.bg, proofOfUs.imageUri);

  if (!imageData) {
    return res.status(500).json({
      message: 'image data could not be created',
    });
  }

  const manifest = await createManifest(proofOfUs, imageData.url);
  const metadata = await createMetaDataUrl(manifest, proofOfUs.manifestUri);

  if (!metadata) {
    return res.status(500).json({
      message: 'metadata data could not be created',
    });
  }

  const client = new NFTStorage({ token: process.env.NFTSTORAGE_API_TOKEN });
  const results = await Promise.allSettled([
    client.storeCar(imageData.data.car),
    client.storeCar(metadata.data.car),
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
        imageCid: imageData.data.cid.toString(),
        imageUrl: imageData.url,
        metadataCid: metadata.data.cid.toString(),
        metadataUrl: metadata.url,
      },
      null,
      2,
    ),
  });
}
