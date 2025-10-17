import dotenv from 'dotenv';

dotenv.config();

export function GET(request: Request) {
  return new Response('Hello from Vercel!');
}

export const config = {
  runtime: 'edge',
};
