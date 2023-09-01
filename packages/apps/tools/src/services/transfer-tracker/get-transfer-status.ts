import { type ChainwebChainId } from '@kadena/chainweb-node-client';
import { type ICommand, Pact } from '@kadena/client';

import { getTransferData } from '../cross-chain-transfer-finish/get-transfer-data';

import client from '@/constants/client';
import { type Network } from '@/constants/kadena';
import { chainNetwork } from '@/constants/network';
import Debug from 'debug';
import { type Translate } from 'next-translate';

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
}: {
  requestKey: string;
  network: Network;
  t: Translate;
  options?: {
    onPoll?: (status: IStatusData) => void;
  };
}): Promise<void> {
  debug(getTransferStatus.name);
  const { onPoll = () => {} } = { ...options };

  try {
    const transferData = await getTransferData({
      requestKey,
      network,
      t,
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
        receiverAccount: receiver.account,
        receiverChain: receiver.chain,
        senderAccount: sender.account || t('Not found'),
        senderChain: sender.chain,
        amount,
        options,
        t,
      });

      const xChainTransferData = await getXChainTransferInfo({
        requestKey,
        senderAccount: sender.account,
        senderChain: sender.chain,
        receiverChain: receiver.chain,
        network,
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
  t,
}: {
  requestKey: string;
  senderAccount: string;
  senderChain: ChainwebChainId;
  receiverChain: ChainwebChainId;
  network: Network;
  t: Translate;
}): Promise<IStatusData> {
  debug(getXChainTransferInfo.name);
  try {
    const networkId = chainNetwork[network].network;

    const requestObject = {
      requestKey,
      networkId,
      chainId: senderChain,
    };

    const proof = await client.pollCreateSpv(requestObject, receiverChain);
    const status = await client.listen(requestObject);
    const pactId = status.continuation?.pactId;

    const continuationTransaction = Pact.builder
      .continuation({
        pactId,
        proof,
        rollback: false,
        step: 1,
      })
      .setNetworkId(networkId)
      .setMeta({ chainId: receiverChain })
      .createTransaction();

    const response = await client.dirtyRead(
      continuationTransaction as ICommand,
    );

    if ('error' in response?.result) {
      const error = response.result as unknown as {
        type: string;
        message: string;
      };
      if (
        String(error.type) === 'EvalError' &&
        String(error.message).includes('pact completed')
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
  options,
  t,
}: {
  requestKey: string;
  network: Network;
  senderAccount: string;
  senderChain: ChainwebChainId;
  receiverAccount: string;
  receiverChain: ChainwebChainId;
  amount: number;
  options?: {
    onPoll?: (status: IStatusData) => void;
  };
  t: Translate;
}): Promise<string | undefined> {
  debug(checkForProof.name);

  const { onPoll = () => {} } = { ...options };

  try {
    let count = 0;

    return client.pollCreateSpv(
      {
        requestKey,
        networkId: chainNetwork[network].network,
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
