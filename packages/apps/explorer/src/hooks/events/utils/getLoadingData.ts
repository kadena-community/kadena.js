import { loadingEventData } from '@/components/LoadingSkeleton/loadingData/loadingDataEventquery';
import type { IEventsQueryView } from './getChainsViewData';

/**
 * return default data for loading state
 */
export const getLoadingData = (): IEventsQueryView => {
  return { chainId: '', data: loadingEventData };
};
