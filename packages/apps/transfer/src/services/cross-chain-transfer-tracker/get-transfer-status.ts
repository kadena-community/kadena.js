import { ChainwebNetworkId } from '@kadena/chainweb-node-client';

import { getTransferData } from '../cross-chain-transfer-finish/get-transfer-data';

import { Translate } from 'next-translate';

interface StatusData {
  status: string;
  description: string;
  error?: string;
}

export async function getTransferStatus({
  requestKey,
  server,
  networkId,
  t,
}: {
  requestKey: string;
  server: string;
  networkId: ChainwebNetworkId;
  t: Translate;
}): Promise<StatusData> {
  const transferData = await getTransferData({
    requestKey,
    server,
    networkId,
    t,
  });

  // If not found or error
  if (transferData.error || !transferData.tx) {
    return {
      status: 'error',
      description: transferData.error || t('Transfer not found'),
    };
  }

  // If transfer failed
  if (transferData.tx?.result.status === 'failure') {
    return {
      status: 'error',
      description: transferData.tx.result.error.message,
      error: transferData.tx.result.error.type,
    };
  }

  return {
    status: transferData.tx.result.status,
    description: 'Transfer completed successfully',
  };

  return {
    status: 'success',
    description: 'Transfer completed successfully',
  };
}
