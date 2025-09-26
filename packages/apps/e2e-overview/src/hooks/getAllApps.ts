import type { Database } from '@/database.types';
import { supabaseClient } from '@/utils/db/createClient';
import { useQuery } from '@tanstack/react-query';

export type App = Database['public']['Tables']['apps']['Row'];

export const useAllApps = () => {
  return useQuery<App[]>({
    queryKey: ['apps'],
    queryFn: async () => {
      const { data, error } = await supabaseClient.from('apps').select('*');
      if (error) throw error;
      return data;
    },
  });
};
