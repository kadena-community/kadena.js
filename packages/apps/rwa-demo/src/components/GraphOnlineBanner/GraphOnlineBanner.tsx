import { useNetworkInfoQuery } from '@/__generated__/sdk';
import { NETWORK_POLLING_RATE } from '@/constants';
import { Notification } from '@kadena/kode-ui';
import type { FC } from 'react';
import { useEffect } from 'react';

export const GraphOnlineBanner: FC = () => {
  const variables = {
    pollInterval: NETWORK_POLLING_RATE,
  };

  const { error, stopPolling } = useNetworkInfoQuery(variables);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  if (!error) return;
  return (
    <Notification role="status" intent="warning" type="inlineStacked">
      The Graphql backend is down
    </Notification>
  );
};
