import type { VercelRequest, VercelResponse } from '@vercel/node';

export default (req: VercelRequest, res: VercelResponse) => {
  return res.status(200).json({ message: 'Graph endpoint' });
};
