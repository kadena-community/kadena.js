import { createServerClient as createClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
export const createServerClient = async () => {
  const cookieStore = await cookies();
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
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
    },
  );
};

export const supabase = createClient;
