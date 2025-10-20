import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

export const createHandler =
  (endpoint: string) => async (req: VercelRequest, res: VercelResponse) => {
    try {
      // Extract headers and body from the incoming request
      const { body, headers } = req;

      console.log(1111, headers);
      // Forward the request to the GraphQL backend
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.GRAPH_KEY || '',
          // Forward relevant headers (e.g., Authorization)
        },
        body: JSON.stringify(body),
      });

      // Get the response body and headers
      const data = await response.json();

      // Return the GraphQL response
      return res.status(response.status).json(data);
    } catch (error) {
      console.error('Proxy error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
