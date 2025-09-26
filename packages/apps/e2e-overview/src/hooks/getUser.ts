import type { Database } from '@/database.types';
import { supabaseClient } from '@/utils/db/createClient';
import type { User } from '@sentry/nextjs';
import { useQuery } from '@tanstack/react-query';

export type ProfileData = Database['public']['Tables']['profiles']['Row'];

export const useGetUser = (user?: User | null) => {
  return useQuery<ProfileData>({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      if (error) throw error;
      return data;
    },
  });
};
