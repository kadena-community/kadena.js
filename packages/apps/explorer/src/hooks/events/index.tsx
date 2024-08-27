import { useCallback, useState } from 'react';
import { useRouter } from '../router';
import { useEventData } from './eventData';
import { createArrayOfChains } from './utils/createArrayOfChains';

export const useEvents = () => {
  const router = useRouter();

  const [selectedChains, setSelectedChains] = useState<number[]>([]);
  const [minHeight, setMinHeight] = useState<number | undefined>();
  const [maxHeight, setMaxHeight] = useState<number | undefined>();

  const { data, isLoading, startLoading } = useEventData({
    eventName: router.query.eventname as string,
    minHeight,
    maxHeight,
    selectedChains,
  });

  const handleSubmit = useCallback(
    (values: Record<string, string | undefined>): void => {
      startLoading();

      const chainsArray: number[] = createArrayOfChains(values.chains);
      setSelectedChains(chainsArray);
      setMinHeight(values.minHeight ? parseInt(values.minHeight) : undefined);
      setMaxHeight(values.maxHeight ? parseInt(values.maxHeight) : undefined);
    },
    [selectedChains, minHeight, maxHeight],
  );

  return {
    handleSubmit,
    isLoading,
    innerData: data,
  };
};
