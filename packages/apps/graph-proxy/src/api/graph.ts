import dotenv from 'dotenv';

dotenv.config();

export default async function handler(request: Request): Promise<Response> {
  const GRAPHQL_ENDPOINT = process.env.GRAPH_ENDPOINT_TEST || '';

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: request.body ? JSON.stringify(await request.json()) : undefined,
    });

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

export const config = {
  runtime: 'edge',
};
