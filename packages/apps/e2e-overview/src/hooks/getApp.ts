import { supabaseClient } from '@/utils/db/createClient';
import { useQuery } from '@tanstack/react-query';
import type { App } from './getAllApps';

export const useApp = (id?: string) => {
  return useQuery<App>({
    queryKey: [`app`, id],
    queryFn: async () => {
      if (!id) return '';
      const { data, error } = await supabaseClient
        .from('apps')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  });
};
