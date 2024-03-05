import { dotenv } from '@utils/dotenv';

export async function getNetworkId(
  newtorkHost: string = dotenv.NETWORK_HOST,
): Promise<string> {
  const res = await fetch(`${newtorkHost}/info`);
  const data = await res.json();
  return data.nodeVersion as string;
}
