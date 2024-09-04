import { runJob } from '@/scripts/faucetCron';

export async function GET(request: Request) {
  await runJob();
  return new Response(`Hello from ${process.env.VERCEL_REGION}`);
}
