import type { NextRequest } from 'next/server';
import { alerts } from './alerts';
import type { ICronType } from './utils/constants';
import { isCronType } from './utils/constants';

export async function GET(request: NextRequest) {
  console.log(request.nextUrl.searchParams);
  const t = request.nextUrl.searchParams.get('t') as ICronType;

  if (!t || !isCronType(t)) {
    return new Response('The t Param is missing', { status: 500 });
  }

  // filter the alerts on crontype, so that we can differentiate between the intervals. see the t param in vercel.json
  const filteredAlerts = alerts.filter((alert) => alert.cronType === t);
  const promises = filteredAlerts.map((alert) => alert.messageType(alert));

  const results = await Promise.all(promises);

  return new Response(
    `alerts triggered on ${t} (${results.flat().length}):\n${results.flat().join('\n')}`,
  );
}

export const revalidate = 0;
