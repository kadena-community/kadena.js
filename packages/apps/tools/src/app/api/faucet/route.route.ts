import { runJob } from '@/scripts/faucetCron';

export async function GET(request: Request) {
  await runJob();
  return new Response(`Faucet balance`);
}

export const revalidate = 0;
