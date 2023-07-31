/**
 *   https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';

const GOOGLE_APPLICATION_CREDENTIALS: string | undefined =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ?? undefined;

// Using a default constructor instructs the client to use the credentials
// specified in GOOGLE_APPLICATION_CREDENTIALS environment variable.
const credential =
  GOOGLE_APPLICATION_CREDENTIALS !== undefined
    ? JSON.parse(
        Buffer.from(GOOGLE_APPLICATION_CREDENTIALS, 'base64').toString(),
      )
    : {};

const analyticsDataClient = new BetaAnalyticsDataClient({
  projectId: credential?.project_id,
  credentials: {
    client_email: credential?.client_email,
    private_key: credential?.private_key,
  },
});

export default analyticsDataClient;
