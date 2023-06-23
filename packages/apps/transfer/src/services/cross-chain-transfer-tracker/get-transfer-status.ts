import { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import { getContCommand, pollSpvProof } from '@kadena/client';
import { ChainId } from '@kadena/types';

import { getTransferData } from '../cross-chain-transfer-finish/get-transfer-data';
import { generateApiHost } from '../utils/utils';

import { Translate } from 'next-translate';

export interface StatusData {
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
  server,
  networkId,
  t,
  options,
}: {
  requestKey: string;
  server: string;
  networkId: ChainwebNetworkId;
  t: Translate;
  options?: {
    onPoll?: (status: StatusData) => void;
  };
}): Promise<void> {
  const { onPoll = () => {} } = { ...options };

  try {
    const transferData = await getTransferData({
      requestKey,
      server,
      networkId,
      t,
    });

    // If not found or error
    if (transferData.error || !transferData.tx) {
      onPoll({
        id: 0,
        status: t('Error'),
        description: transferData.error || t('Transfer not found'),
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
      const proof = await checkForProof({
        requestKey,
        networkId,
        server,
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
        senderAccount: sender?.account || '',
        receiverChain: receiver.chain,
        server,
        networkId,
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
  receiverChain,
  server,
  networkId,
  t,
}: {
  requestKey: string;
  senderAccount: string;
  receiverChain: ChainId;
  server: string;
  networkId: ChainwebNetworkId;
  t: Translate;
}): Promise<StatusData> {
  try {
    const proofApiHost = `${generateApiHost(server, networkId, '1')}/spv`;
    const apiHost = generateApiHost(server, networkId, receiverChain);

    const contCommand1 = await getContCommand(
      requestKey,
      receiverChain,
      proofApiHost,
      1,
      false,
    );

    contCommand1
      .setMeta(
        {
          chainId: receiverChain,
          sender: senderAccount,
          gasLimit: 850,
          gasPrice: 0.00000001,
        },
        networkId,
      )
      .createCommand();

    const response = await contCommand1.local(apiHost, {
      preflight: false,
      signatureVerification: false,
    });

    if (
      response?.result?.error?.type === 'EvalError' &&
      response?.result?.error?.message.includes('pact completed')
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
  server,
  networkId,
  senderAccount,
  senderChain,
  receiverAccount,
  receiverChain,
  amount,
  options,
  t,
}: {
  requestKey: string;
  server: string;
  networkId: ChainwebNetworkId;
  senderAccount: string;
  senderChain: ChainId;
  receiverAccount: string;
  receiverChain: ChainId;
  amount: number;
  options?: {
    onPoll?: (status: StatusData) => void;
  };
  t: Translate;
}) {
  const { onPoll = () => {} } = { ...options };

  try {
    const apiHost = `${generateApiHost(server, networkId, '1')}/spv`;
    let count = 0;

    const proof = await pollSpvProof(requestKey, receiverChain, apiHost, {
      onPoll: (response: string) => {
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

    return proof;
  } catch (error) {
    onPoll({
      id: 0,
      status: t('Error'),
      description: t('Could not obtain proof information'),
    });
  }
}
