import { createBrowserClient } from '@supabase/ssr';
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}

export const supabaseClient = createClient();
