import { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import { getContCommand, pollSpvProof } from '@kadena/client';
import { ChainId } from '@kadena/types';

import { getTransferData } from '../cross-chain-transfer-finish/get-transfer-data';

import {
  getKadenaConstantByNetwork,
  kadenaConstants,
  Network,
} from '@/constants/kadena';
import { chainNetwork } from '@/constants/network';
import { Translate } from 'next-translate';

export interface IStatusData {
  id?: number;
  status?: string;
  description?: string;
  error?: string;
  senderAccount?: string;
  senderChain?: string;
  receiverAccount?: string;
  receiverChain?: string;
  amount?: number;
}

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
        id: 0,
        status: t('Error'),
        description: transferData.error ?? t('Transfer not found'),
      });
      return;
    }

    const { result, receiver, sender, amount } = transferData.tx;

    // If transfer has no result
    if (!result) {
      onPoll({
        id: 0,
        status: t('Error'),
        description: t('Transfer with no result'),
      });
      return;
    }

    // If transfer failed
    if (result.status === 'failure') {
      onPoll({
        id: 0,
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
      id: 3,
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
    onPoll({
      id: 0,
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
  senderChain: ChainId;
  receiverChain: ChainId;
  network: Network;
  t: Translate;
}): Promise<IStatusData> {
  try {
    const proofApiHost = getKadenaConstantByNetwork(network).apiHost({
      networkId: chainNetwork[network].network,
      chainId: senderChain,
    });
    const apiHost = getKadenaConstantByNetwork(network).apiHost({
      networkId: chainNetwork[network].network,
      chainId: receiverChain,
    });
    const gasLimit: number = kadenaConstants.GAS_LIMIT;
    const gasPrice: number = kadenaConstants.GAS_PRICE;

    const contCommand = await getContCommand(
      requestKey,
      receiverChain,
      proofApiHost,
      1,
      false,
    );

    contCommand
      .setMeta(
        {
          chainId: receiverChain,
          sender: senderAccount,
          gasLimit,
          gasPrice,
        },
        chainNetwork[network].network as ChainwebNetworkId,
      )
      .createCommand();

    const response = await contCommand.local(apiHost, {
      preflight: false,
      signatureVerification: false,
    });

    if (
      String(response?.result?.error?.type) === 'EvalError' &&
      String(response?.result?.error?.message).includes('pact completed')
    ) {
      return {
        id: 3,
        status: t('Success'),
        description: t('Transfer completed successfully'),
        senderAccount: senderAccount,
        receiverChain: receiverChain,
      };
    }

    if (response?.result?.status === 'success') {
      return {
        id: 2,
        status: t('Pending'),
        description: t('Transfer pending - waiting for continuation command'),
        senderAccount: senderAccount,
        receiverChain: receiverChain,
      };
    }

    return {
      id: 0,
      status: t('Error'),
      description: t('Transfer not found'),
    };
  } catch (error) {
    console.log(error);
    return {
      id: 0,
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
  senderChain: ChainId;
  receiverAccount: string;
  receiverChain: ChainId;
  amount: number;
  options?: {
    onPoll?: (status: IStatusData) => void;
  };
  t: Translate;
}): Promise<Response | undefined> {
  const { onPoll = () => {} } = { ...options };

  try {
    const apiHost = getKadenaConstantByNetwork(network).apiHost({
      networkId: chainNetwork[network].network,
      chainId: senderChain,
    });
    let count = 0;

    return await pollSpvProof(requestKey, receiverChain, apiHost, {
      onPoll: () => {
        // Avoid status update on first two polls (to avoid flickering)
        if (count > 1) {
          onPoll({
            id: 1,
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
    });
  } catch (error) {
    onPoll({
      id: 0,
      status: t('Error'),
      description: t('Could not obtain proof information'),
    });
  }
}
