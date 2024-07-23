export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./utils/sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./utils/sentry.edge.config');
  }
}
