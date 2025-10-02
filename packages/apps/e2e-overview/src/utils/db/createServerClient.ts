import { createServerClient as createClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { env } from '../env';
export const createServerClient = async () => {
  const cookieStore = await cookies();

  if (!env.SUPABASE_PROJECT_URL || !env.SUPABASE_PUBLISHABLE_KEY) {
    //needed for build without env vars
    return '' as unknown as SupabaseClient<any, 'public', any>;
  }

  return createClient(env.SUPABASE_PROJECT_URL, env.SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};

export const supabase = createClient;
