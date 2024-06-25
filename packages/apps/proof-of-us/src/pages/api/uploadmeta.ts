import { store } from '@/utils/socket/store';
import pinataSDK from '@pinata/sdk';
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';

interface IResponseData {
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IResponseData | IUploadResult>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      message: 'method not allowed',
    });
  }

  const body = JSON.parse(req.body);
  console.log({ body });
  const proofOfUsId = body.proofOfUsId;
  const manifest = body.manifest;

  if (!manifest || !proofOfUsId) {
    return res.status(500).json({
      message: 'manifest data could not be created',
    });
  }

  if (!process.env.NEXT_PUBLIC_PINATA_JWT) {
    return res.status(500).json({
      message: 'api token not found',
    });
  }

  const pinata = new pinataSDK({
    pinataJWTKey: process.env.NEXT_PUBLIC_PINATA_JWT,
  });

  const options = {
    pinataMetadata: {
      name: `${proofOfUsId} metadata`,
    },
    pinataOptions: {},
  };

  console.log({ manifest });
  const metadata = await pinata.pinJSONToIPFS(manifest, options);

  if (!metadata) {
    return res.status(500).json({
      message: 'metadata data could not be created',
    });
  }

  return res.status(200).json({
    url: `https://ipfs.io/ipfs/${metadata.IpfsHash}`,
    cid: metadata.IpfsHash,
  } as IUploadResult);
}
