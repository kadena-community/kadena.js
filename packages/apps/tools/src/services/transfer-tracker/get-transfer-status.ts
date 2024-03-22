import client from '@/constants/client';
import type { Network } from '@/constants/kadena';
import type { INetworkData } from '@/utils/network';
import { getApiHost } from '@/utils/network';
import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import type { ICommand } from '@kadena/client';
import { Pact } from '@kadena/client';
import Debug from 'debug';
import type { Translate } from 'next-translate';
import { getTransferData } from '../cross-chain-transfer-finish/get-transfer-data';

export enum StatusId {
  Error = 'error',
  Pending = 'pending',
  Success = 'success',
  NotFound = 'not found',
}

export interface IStatusData {
  id?: StatusId;
  status?: string;
  description?: string;
  error?: string;
  senderAccount?: string;
  senderChain?: string;
  receiverAccount?: string;
  receiverChain?: string;
  amount?: number;
}

const debug = Debug('kadena-transfer:services:get-transfer-status');

export async function getTransferStatus({
  requestKey,
  network,
  t,
  options,
  networksData,
}: {
  requestKey: string;
  network: Network;
  t: Translate;
  options?: {
    onPoll?: (status: IStatusData) => void;
  };
  networksData: INetworkData[];
}): Promise<void> {
  debug(getTransferStatus.name);
  const { onPoll = () => {} } = { ...options };

  try {
    const transferData = await getTransferData({
      requestKey,
      network,
      t,
      networksData,
    });

    // If not found or error
    if (Boolean(transferData?.error) || !transferData?.tx) {
      onPoll({
        id: StatusId.Error,
        status: t('Error'),
        description: transferData.error ?? t('Transfer not found'),
      });
      return;
    }

    const { result, receiver, sender, amount } = transferData.tx;

    // If transfer has no result
    if (!result) {
      onPoll({
        id: StatusId.Error,
        status: t('Error'),
        description: t('Transfer with no result'),
      });
      return;
    }

    // If transfer failed
    if (result.status === 'failure') {
      onPoll({
        id: StatusId.Error,
        status: t('Error'),
        //@ts-ignore
        description: result.error.message,
        //@ts-ignore
        error: result.error.type,
        senderAccount: sender.account,
        senderChain: sender.chain,
        receiverAccount: receiver.account,
        receiverChain: receiver.chain,
        amount,
      });
      return;
    }

    //If crosschain transfer
    if (sender.chain !== receiver.chain) {
      await checkForProof({
        requestKey,
        network,
        receiverAccount: receiver.account ?? t('Not found'),
        receiverChain: receiver.chain,
        senderAccount: sender.account ?? t('Not found'),
        senderChain: sender.chain,
        amount,
        networksData,
        options,
        t,
      });

      const xChainTransferData = await getXChainTransferInfo({
        requestKey,
        senderAccount: sender.account,
        senderChain: sender.chain,
        receiverChain: receiver.chain,
        network,
        networksData,
        t,
      });

      onPoll({
        ...xChainTransferData,
        amount,
        senderChain: sender.chain,
        receiverAccount: receiver.account,
      });
      return;
    }

    onPoll({
      id: StatusId.Success,
      status: t('Success'),
      description: t('Transfer completed successfully'),
      senderAccount: sender.account,
      senderChain: sender.chain,
      receiverAccount: receiver.account,
      receiverChain: receiver.chain,
      amount,
    });
    return;
  } catch (error) {
    debug(error);
    onPoll({
      id: StatusId.Error,
      status: t('Error'),
      description: t('Transfer not found'),
    });
    return;
  }
}

export async function getXChainTransferInfo({
  requestKey,
  senderAccount,
  senderChain,
  receiverChain,
  network,
  networksData,
  t,
}: {
  requestKey: string;
  senderAccount?: string;
  senderChain: ChainwebChainId;
  receiverChain: ChainwebChainId;
  network: Network;
  networksData: INetworkData[];
  t: Translate;
}): Promise<IStatusData> {
  debug(getXChainTransferInfo.name);
  try {
    const networkData: INetworkData | undefined = networksData.find(
      (item) => (network as Network) === item.networkId,
    );

    if (!networkData) return { error: 'No network found' };

    const requestObject = {
      requestKey,
      networkId: networkData.networkId,
      chainId: senderChain,
    };

    const apiHostSender = getApiHost({
      api: networkData.API,
      chainId: senderChain,
      networkId: networkData.networkId,
    });

    const { pollCreateSpv, listen } = client(apiHostSender);
    const proof = await pollCreateSpv(requestObject, receiverChain);
    const status = await listen(requestObject);
    const pactId = status.continuation!.pactId;

    const continuationTransaction = Pact.builder
      .continuation({
        pactId,
        proof,
        rollback: false,
        step: 1,
      })
      .setNetworkId(networkData.networkId)
      .setMeta({ chainId: receiverChain })
      .createTransaction();

    const apiHostReceiver = getApiHost({
      api: networkData.API,
      chainId: receiverChain,
      networkId: networkData.networkId,
    });
    const { dirtyRead } = client(apiHostReceiver);

    const response = await dirtyRead(continuationTransaction as ICommand);

    if ('error' in response?.result) {
      const failed = response.result as unknown as {
        status: string;
        error: {
          type: string;
          message: string;
        };
      };

      if (
        String(failed.error.type) === 'EvalError' &&
        String(failed.error.message).includes('pact completed')
      ) {
        return {
          id: StatusId.Success,
          status: t('Success'),
          description: t('Transfer completed successfully'),
          senderAccount: senderAccount,
          receiverChain: receiverChain,
        };
      }
    }

    if (response?.result?.status === 'success') {
      return {
        id: StatusId.Pending,
        status: t('Pending'),
        description: t('Transfer pending - waiting for continuation'),
        senderAccount: senderAccount,
        receiverChain: receiverChain,
      };
    }

    return {
      id: StatusId.Error,
      status: t('Error'),
      description: t('Transfer not found'),
    };
  } catch (error) {
    debug(error);
    return {
      id: StatusId.Error,
      status: t('Error'),
      description: t('Transfer not found'),
    };
  }
}

export async function checkForProof({
  requestKey,
  network,
  senderAccount,
  senderChain,
  receiverAccount,
  receiverChain,
  amount,
  networksData,
  options,
  t,
}: {
  requestKey: string;
  network: Network;
  senderAccount: string;
  senderChain: ChainwebChainId;
  receiverAccount: string;
  receiverChain: ChainwebChainId;
  amount?: number;
  networksData: INetworkData[];
  options?: {
    onPoll?: (status: IStatusData) => void;
  };
  t: Translate;
}): Promise<string | undefined> {
  debug(checkForProof.name);

  const { onPoll = () => {} } = { ...options };

  const networkData: INetworkData | undefined = networksData.find(
    (item) => (network as Network) === item.networkId,
  );

  if (!networkData) return '';

  const apiHostSender = getApiHost({
    api: networkData.API,
    chainId: senderChain,
    networkId: network,
  });

  try {
    let count = 0;

    const { pollCreateSpv } = client(apiHostSender);

    return pollCreateSpv(
      {
        requestKey,
        networkId: networkData.networkId,
        chainId: senderChain,
      },
      receiverChain,
      {
        onPoll: () => {
          // Avoid status update on first two polls (to avoid flickering)
          if (count > 1) {
            onPoll({
              id: StatusId.Pending,
              status: t('Pending'),
              description: t('Transfer pending - waiting for proof'),
              senderAccount,
              senderChain,
              receiverAccount,
              receiverChain,
              amount,
            });
          }
          count++;
        },
      },
    );
  } catch (error) {
    debug(error);
    onPoll({
      id: StatusId.Error,
      status: t('Error'),
      description: t('Could not obtain proof information'),
    });
  }
}
