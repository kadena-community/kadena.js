import pinataSDK from '@pinata/sdk';
import type { NextApiRequest, NextApiResponse } from 'next';

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
  const manifest = body.manifest;

  if (!manifest) {
    return res.status(500).json({
      message: 'manifest data could not be created',
    });
  }

  if (!process.env.PINATA_JWT) {
    return res.status(500).json({
      message: 'api token not found',
    });
  }

  const pinata = new pinataSDK({
    pinataJWTKey: process.env.PINATA_JWT,
  });

  const options = {
    pinataMetadata: {
      name: `metadata for ${manifest.image}`,
    },
    pinataOptions: {},
  };

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
