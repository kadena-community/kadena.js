import * as Sentry from '@sentry/nextjs';
import { BrowserTracing } from '@sentry/tracing';
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  sendDefaultPii: true,
  integrations: [new BrowserTracing()],
});
