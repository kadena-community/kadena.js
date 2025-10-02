import type { Database } from '@/database.types';
import { supabaseClient } from '@/utils/db/createClient';
import { useQuery } from '@tanstack/react-query';

export type TestRun = Database['public']['Tables']['runs']['Row'];

export const useTestRuns = (testId?: string) => {
  return useQuery<TestRun[]>({
    queryKey: [`app_test_versions_run`, testId],
    queryFn: async (): Promise<TestRun[]> => {
      if (!testId) return [];
      const { data, error } = await supabaseClient
        .from('runs')
        .select('*')
        .eq('version_id', testId);
      if (error) throw error;
      return data || [];
    },
    enabled: Boolean(testId),
  });
};
