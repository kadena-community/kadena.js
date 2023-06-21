import { ChainwebNetworkId } from '@kadena/chainweb-node-client';
import { getContCommand } from '@kadena/client';
import { ChainId } from '@kadena/types';

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
}): Promise<StatusData | undefined> {
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
  } catch (error) {}
}

export async function getXChainTransferInfo() {
  //   {
  //   senderChain,
  //   senderAccount,
  //   receiverChain,
  //   receiverAccount,
  // }: {
  //   senderChain: ChainId;
  //   senderAccount: string;
  //   receiverChain: ChainId;
  //   receiverAccount: string;
  // }
  try {
    const contCommand = await getContCommand(
      'AnAHRezOySWrxfqSpGjiwB6lNmOnEe6U0bWsBmyS__0',
      '4',
      'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/spv',
      1,
      false,
    );

    contCommand.createCommand();

    // contCommand.local(
    //   'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/4/pact',
    //   {
    //     preflight: false,
    //     signatureVerification: false,
    //   },
    // );

    console.log(contCommand);
  } catch (error) {
    console.log(error);
  }
}
