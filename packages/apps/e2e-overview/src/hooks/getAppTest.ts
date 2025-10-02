import { supabaseClient } from '@/utils/db/createClient';
import { useQuery } from '@tanstack/react-query';
import type { AppTestVersion } from './getAllAppTestVersions';

export const useAppTest = (appId: string, id?: string) => {
  return useQuery<AppTestVersion>({
    queryKey: [`app_test_versions`, appId, id],
    queryFn: async () => {
      if (!id) return '';
      const { data, error } = await supabaseClient
        .from('app_test_versions')
        .select('*')
        .eq('id', id)
        .eq('app_id', appId)
        .single();
      if (error) throw error;
      return data;
    },
  });
};
