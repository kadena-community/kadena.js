import { runJob } from '@/scripts/graphCron';

export async function GET(request: Request) {
  await runJob();
  return new Response(`Graph cron job`);
}

export const revalidate = 0;
