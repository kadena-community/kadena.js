import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

const GRAPHQL_ENDPOINT = process.env.GRAPH_ENDPOINT_TEST ?? ''; // Replace with your GraphQL server URL

const handler = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract headers and body from the incoming request
    const { body, headers } = req;

    console.log(headers);
    // Forward the request to the GraphQL backend
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

export default handler;
