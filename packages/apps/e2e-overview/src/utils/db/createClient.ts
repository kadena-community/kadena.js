import { createBrowserClient } from '@supabase/ssr';
import { env } from '../env';
export function createClient() {
  return createBrowserClient(
    env.SUPABASE_PROJECT_URL,
    env.SUPABASE_PUBLISHABLE_KEY,
  );
}

export const supabaseClient = createClient();
