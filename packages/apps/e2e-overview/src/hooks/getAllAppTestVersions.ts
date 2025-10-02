import type { Database } from '@/database.types';
import { supabaseClient } from '@/utils/db/createClient';
import { useQuery } from '@tanstack/react-query';

export type AppTestVersion =
  Database['public']['Tables']['app_test_versions']['Row'];
export type UpdateAppTestVersion =
  Database['public']['Tables']['app_test_versions']['Update'];
export type InsertAppTestVersion =
  Database['public']['Tables']['app_test_versions']['Insert'];

export const useAllAppTestVersions = ({ appId }: { appId?: string }) => {
  return useQuery<AppTestVersion[]>({
    queryKey: ['app_test_versions', appId],
    queryFn: async () => {
      if (!appId) return [];
      const { data, error } = await supabaseClient
        .from('app_test_versions')
        .select('*')
        .eq('app_id', appId)
        .order('version', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
};
