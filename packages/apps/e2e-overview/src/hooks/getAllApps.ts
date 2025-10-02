import type { Database } from '@/database.types';
import { supabaseClient } from '@/utils/db/createClient';
import { useQuery } from '@tanstack/react-query';

export type App = Database['public']['Tables']['apps']['Row'];
export type UpdateApp = Database['public']['Tables']['apps']['Update'];
export type InsertApp = Database['public']['Tables']['apps']['Insert'];

interface IProps {
  dashboard?: boolean;
}

export const useAllApps = ({ dashboard }: IProps = {}) => {
  return useQuery<App[]>({
    queryKey: ['apps'],
    queryFn: async () => {
      let query = supabaseClient
        .from('apps')
        .select('*')
        .order('name', { ascending: false });

      if (dashboard) {
        query = query.eq('is_on_dashboard', true).eq('is_active', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
};
