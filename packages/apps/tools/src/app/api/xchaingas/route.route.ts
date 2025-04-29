import { runJob } from '@/scripts/xchaingas';

export async function GET(request: Request) {
  await runJob();
  return new Response(`xchain gas`);
}

export const revalidate = 0;
