import type { NextRequest } from 'next/server';
import { getAllAlertPromises } from '../utils/getAllAlertPromises';
import { alerts } from './../alerts';

export async function GET(request: NextRequest) {
  // filter the alerts on crontype, so that we can differentiate between the intervals. see the t param in vercel.json
  const filteredAlerts = alerts.filter((alert) => alert.isElastic);
  const results = await getAllAlertPromises(filteredAlerts, true);

  return new Response(
    `alerts triggered on elastic (${results.flat().length}):\n${results.flat().join('\n')}`,
  );
}

export const revalidate = 0;
