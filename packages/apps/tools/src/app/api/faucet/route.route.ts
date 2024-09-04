import { runJob } from '@/scripts/faucetCron';
import { channelId, tokenId } from '@/scripts/faucetCron/constants';

export async function GET(request: Request) {
  await runJob();
  return new Response(`Hello ${channelId} - ${tokenId}`);
}
