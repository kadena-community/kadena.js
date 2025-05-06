import { runJob } from '@/scripts/galxe';

export async function GET(request: Request) {
  console.log(`galxe balance check start`);
  await runJob();
  return new Response(`galxe balance check`);
}

export const revalidate = 0;
