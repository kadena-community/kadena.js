import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { env } from '../env';

export function createClient() {
  if (!env.SUPABASE_PROJECT_URL || !env.SUPABASE_PUBLISHABLE_KEY) {
    //needed for build without env vars
    return '' as unknown as SupabaseClient<any, 'public', any>;
  }
  return createBrowserClient(
    env.SUPABASE_PROJECT_URL,
    env.SUPABASE_PUBLISHABLE_KEY,
  );
}

export const supabaseClient = createClient();
