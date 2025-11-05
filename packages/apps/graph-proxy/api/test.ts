import type { VercelRequest, VercelResponse } from '@vercel/node';

export const handler = async (req: VercelRequest, res: VercelResponse) => {
  // Return the GraphQL response
  return res.status(200).json({ message: 'Test API is working' });
};
