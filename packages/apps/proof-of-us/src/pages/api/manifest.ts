import { createManifest } from '@/utils/createManifest';
import { store } from '@/utils/socket/store';
import { createImageUrl, createMetaDataUrl } from '@/utils/upload';
import fetch from 'cross-fetch';
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
  const uri = body.uri as string;

  if (!uri) {
    return res.status(404).json({
      message: 'uri not found',
    });
  }

  const result = await fetch(uri);
  const data = (await result.json()) as IProofOfUsTokenMeta;

  res.status(200).json({
    message: JSON.stringify(
      {
        data,
      },
      null,
      2,
    ),
  });
}
