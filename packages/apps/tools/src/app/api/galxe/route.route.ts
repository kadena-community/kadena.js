import { runJob } from '@/scripts/galxe';

export async function GET(request: Request) {
  await runJob();
  return new Response(`galxe balance check`);
}

export const revalidate = 0;
