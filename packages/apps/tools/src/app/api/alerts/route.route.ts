import type { NextRequest } from 'next/server';
import { alerts } from './alerts';

import { IIntervalGroup, isIntervalGroup } from './utils/constants';
import { getAllAlertPromises } from './utils/getAllAlertPromises';

export async function GET(request: NextRequest) {
  const t = request.nextUrl.searchParams.get('t') as IIntervalGroup;

  if (!t || !isIntervalGroup(t)) {
    return new Response('The t Param is missing', { status: 500 });
  }

  // filter the alerts on crontype, so that we can differentiate between the intervals. see the t param in vercel.json
  const filteredAlerts = alerts.filter((alert) => alert.intervalGroup === t);
  const results = await getAllAlertPromises(filteredAlerts);

  return new Response(
    `alerts triggered on ${t} (${results.flat().length}):\n${results.flat().join('\n')}`,
  );
}

export const revalidate = 0;
