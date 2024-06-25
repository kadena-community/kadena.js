import { store } from '@/utils/socket/store';
import pinataSDK from '@pinata/sdk';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';

interface IResponseData {
  message: string;
}

const fileSizeLimitMb = 2;

const checksizeIsOk = (base64: string): boolean => {
  const base64String = base64.replaceAll('=', '');
  const size = base64String.length * (3 / 4);
  if (size > fileSizeLimitMb * 1024 * 1024) {
    return false;
  }
  return true;
};

export const uploadImageString = async (base64: string): Promise<any> => {
  if (!checksizeIsOk(base64) || !process.env.PINATA_JWT) {
    return;
  }

  const pinata = new pinataSDK({
    pinataJWTKey: process.env.PINATA_JWT,
  });

  const fileName = `Proof of Us image`;
  const options = {
    pinataMetadata: {
      name: fileName,
    },
    pinataOptions: {},
  };

  const base64Data = base64.replace(/^data:image\/png;base64,/, '');
  const buffer = Buffer.from(base64Data, 'base64');

  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  return await pinata.pinFileToIPFS(stream, options);
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
  const proofOfUsId = body.proofOfUsId;

  const background = await store.getBackground(proofOfUsId);
  if (!background?.bg) {
    return res.status(404).json({
      message: 'background not found',
    });
  }

  if (!process.env.PINATA_JWT) {
    return res.status(500).json({
      message: 'api token not found',
    });
  }

  if (!checksizeIsOk(background?.bg)) {
    return res.status(500).json({
      message: `the image more than ${fileSizeLimitMb}Mb`,
    });
  }

  const imageData = await uploadImageString(background?.bg);

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
