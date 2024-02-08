import { store } from '@/utils/socket/store';
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      message: 'method not allowed',
    });
  }

  const body = JSON.parse(req.body);
  const proofOfUsId = body.proofOfUsId;

  const background = await store.getBackground(proofOfUsId);

  if (!background) {
    return res.status(404).json({
      message: 'background not found!',
    });
  }

  //TODO: UPLOAD THE BACKGROUND

  res.status(200).json({ message: 'Hello from Next.js!' });
}
