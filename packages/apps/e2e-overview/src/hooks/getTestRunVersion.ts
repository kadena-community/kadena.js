import { supabaseClient } from '@/utils/db/createClient';
import { useQuery } from '@tanstack/react-query';

import type { TestRun } from './getTestRuns';

export const useTestRunVersion = ({
  versionId,
  runId,
}: {
  versionId: string;
  runId: string;
}) => {
  return useQuery<TestRun>({
    queryKey: [`testrunversion`, versionId, runId],
    queryFn: async () => {
      const { data, error } = await supabaseClient
        .from('runs')
        .select('*')
        .eq('id', runId)
        .eq('version_id', versionId)
        .single();
      if (error) throw error;
      return data;
    },
  });
};
