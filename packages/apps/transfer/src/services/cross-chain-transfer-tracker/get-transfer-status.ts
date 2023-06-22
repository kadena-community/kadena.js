import { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import { getContCommand, pollSpvProof } from '@kadena/client';
import { ChainId } from '@kadena/types';

import { getTransferData } from '../cross-chain-transfer-finish/get-transfer-data';
import { generateApiHost } from '../utils/utils';

import { Translate } from 'next-translate';

export interface StatusData {
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
}: {
  requestKey: string;
  server: string;
  networkId: ChainwebNetworkId;
  t: Translate;
}): Promise<StatusData> {
  try {
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

    const { result, receiver, sender, amount } = transferData.tx;

    // If transfer has no result
    if (!result) {
      return {
        status: 'error',
        description: t('Transfer with no result'),
      };
    }

    // If transfer failed
    if (result.status === 'failure') {
      return {
        status: 'error',
        description: result.error.message,
        error: result.error.type,
        senderAccount: sender.account,
        senderChain: sender.chain,
        receiverAccount: receiver.account,
        receiverChain: receiver.chain,
        amount,
      };
    }

    if (sender.chain !== receiver.chain) {
      const xChainTransferData = await getXChainTransferInfo({
        requestKey,
        senderAccount: sender.account || '',
        receiverChain: receiver.chain,
        server,
        networkId,
        t,
      });

      return {
        ...xChainTransferData,
        amount,
        senderChain: sender.chain,
        receiverAccount: receiver.account,
      };
    }

    // return {
    //   status: transferData.tx.result.status,
    //   description: 'Transfer completed successfully',
    // };

    return {
      status: 'success',
      description: 'Transfer completed successfully',
      senderAccount: sender.account,
      senderChain: sender.chain,
      receiverAccount: receiver.account,
      receiverChain: receiver.chain,
      amount,
    };
  } catch (error) {
    return {
      status: 'error',
      description: t('Transfer not found'),
    };
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
    // const contCommand = await getContCommand(
    //   'AnAHRezOySWrxfqSpGjiwB6lNmOnEe6U0bWsBmyS__0',
    //   '4',
    //   'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/spv',
    //   1,
    //   false,
    // );

    // contCommand.local(
    //   'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/4/pact',
    //   {
    //     preflight: false,
    //     signatureVerification: false,
    //   },
    // );

    const proofApiHost = `${generateApiHost(server, networkId, '1')}/spv`;
    const apiHost = generateApiHost(server, networkId, receiverChain);

    const proof = await pollSpvProof(requestKey, receiverChain, proofApiHost, {
      timeout: 1000,
      onPoll: (response) => {
        console.log('On Poll Response', response);
      },
    });

    const contCommand1 = await getContCommand(
      requestKey,
      receiverChain,
      proofApiHost,
      1,
      false,
    );

    contCommand1.setMeta(
      {
        chainId: receiverChain,
        sender: senderAccount,
        gasLimit: 850,
        gasPrice: 0.00000001,
      },
      networkId,
    );

    contCommand1.createCommand();

    const response = await contCommand1.local(apiHost, {
      preflight: false,
      signatureVerification: false,
    });

    if (
      response?.result?.error?.type === 'EvalError' &&
      response?.result?.error?.message.includes('pact completed')
    ) {
      return {
        status: 'success',
        description: 'Transfer completed successfully',
        senderAccount: senderAccount,
        receiverChain: receiverChain,
      };
    }

    if (response?.result?.status === 'success') {
      return {
        status: 'pending',
        description: 'Transfer pending - waiting for continuation command',
        senderAccount: senderAccount,
        receiverChain: receiverChain,
      };
    }

    return {
      status: 'error',
      description: t('Transfer not found'),
    };
  } catch (error) {
    console.log(error);
    return {
      status: 'error',
      description: t('Transfer not found'),
    };
  }
}
