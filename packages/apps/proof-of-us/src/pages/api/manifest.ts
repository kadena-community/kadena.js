import type { NextApiRequest, NextApiResponse } from 'next';

interface IResponseData {
  message: any;
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

  const uri = req.body.uri as string;

  if (!uri) {
    return res.status(404).json({
      message: 'uri not found',
    });
  }

  const result = await fetch(uri, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const json = await result.json();

  res.status(200).json(json);
}
