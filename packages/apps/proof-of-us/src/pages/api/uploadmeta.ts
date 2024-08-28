import pinataSDK from '@pinata/sdk';
import type { NextApiRequest, NextApiResponse } from 'next';

interface IResponseData {
  message: string;
}

export const uploadMeta = async (metadata: any): Promise<IUploadResult> => {
  if (!process.env.PINATA_JWT) {
    return {
      url: '',
      cid: '',
    };
  }

  const pinata = new pinataSDK({
    pinataJWTKey: process.env.PINATA_JWT,
  });

  const options = {
    pinataMetadata: {
      name: `metadata for ${metadata.image}`,
    },
    pinataOptions: {},
  };
  const result = await pinata.pinJSONToIPFS(metadata, options);
  return {
    url: `https://ipfs.io/ipfs/${result.IpfsHash}`,
    cid: result.IpfsHash,
  };
};

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

  const metadata = await uploadMeta(manifest);
  if (!metadata) {
    return res.status(500).json({
      message: 'metadata data could not be created',
    });
  }

  return res.status(200).json(metadata);
}
