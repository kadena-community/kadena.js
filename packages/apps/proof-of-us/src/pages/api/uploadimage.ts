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
  const proofOfUsId = body.proofOfUsId;

  const background = await store.getBackground(proofOfUsId);
  if (!background?.bg) {
    return res.status(404).json({
      message: 'background not found',
    });
  }

  const fileSizeLimitMb = 2;
  const base64String = background.bg.replaceAll('=', '');
  const size = base64String.length * (3 / 4);
  if (size > fileSizeLimitMb * 1024 * 1024) {
    return res.status(500).json({
      message: `the image more than ${fileSizeLimitMb}Mb`,
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

  const fileName = `${proofOfUsId}.png`;
  const options = {
    pinataMetadata: {
      name: fileName,
    },
    pinataOptions: {},
  };

  const base64Data = background.bg.replace(/^data:image\/png;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  const imageData = await pinata.pinFileToIPFS(stream, options);

  if (!imageData) {
    return res.status(500).json({
      message: 'image data could not be created',
    });
  }

  return res.status(200).json({
    url: `https://ipfs.io/ipfs/${imageData.IpfsHash}`,
    cid: imageData.IpfsHash,
  } as IUploadResult);
}
