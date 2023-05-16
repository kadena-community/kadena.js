import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.method);
  if (req.method !== 'POST') {
    res.status(500);
    res.end();
  }
  res.status(200).json({ name: 'John Doe' });
};
