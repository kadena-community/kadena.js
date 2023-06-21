import { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import { getContCommand, pollSpvProof } from '@kadena/client';
import { ChainId } from '@kadena/types';

import { getTransferData } from '../cross-chain-transfer-finish/get-transfer-data';
import { generateApiHost } from '../utils/utils';

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
  // }): Promise<StatusData | undefined> {
}): Promise<any> {
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

    const { result, receiver, sender } = transferData.tx;

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
      };
    }

    if (sender.chain !== receiver.chain) {
      return await getXChainTransferInfo({
        requestKey,
        senderAccount: sender.account || '',
        receiverChain: receiver.chain,
        server,
        networkId,
      });
    }

    // return {
    //   status: transferData.tx.result.status,
    //   description: 'Transfer completed successfully',
    // };

    return {
      status: 'success',
      description: 'Transfer completed successfully',
    };
  } catch (error) {}
}

export async function getXChainTransferInfo({
  requestKey,
  senderAccount,
  receiverChain,
  server,
  networkId,
}: {
  requestKey: string;
  senderAccount: string;
  receiverChain: ChainId;
  server: string;
  networkId: ChainwebNetworkId;
}) {
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
      timeout: 100,
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
      };
    }

    if (response?.result?.status === 'success') {
      return {
        status: 'pending',
        description: 'Transfer pending - waiting for continuation command',
      };
    }

    console.log(contCommand1);

    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
}
