import { supabaseClient } from '@/utils/db/createClient';
import { useQuery } from '@tanstack/react-query';

type TestRun = Database['public']['Tables']['runs']['Row'];

export const useTestRuns = (testId?: string) => {
  return useQuery<TestRun[]>({
    queryKey: [`app_test_versions_run`, testId],
    queryFn: async () => {
      if (!testId) return '';
      const { data, error } = await supabaseClient
        .from('runs')
        .select('*')
        .eq('version_id', testId);
      if (error) throw error;
      return data;
    },
  });
};
