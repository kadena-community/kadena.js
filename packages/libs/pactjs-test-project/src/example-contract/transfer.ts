import { poll, SendResponse } from '@kadena/chainweb-node-client';
import { Pact, signWithChainweaver } from '@kadena/client';

const apiHost = (
  chainId: string,
  network: string = '',
  networkId: string = 'mainnet01',
  apiVersion: string = '0.0',
): string => {
  return `https://api.${network}chainweb.com/chainweb/${apiVersion}/${networkId}/chain/${chainId}/pact`;
};

const testnetChain1ApiHost: string = apiHost('1', 'testnet.', 'testnet04');

async function transactionMain(): Promise<void> {
  const senderAccount: string =
    'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';
  const receiverAccount: string =
    'k:e34b62cb48526f89e419dae4e918996d66582b5951361c98ee387665a94b7ad8';
  const onlyKey = (s: string): string => s.split(':')[1];

  const amount: { decimal: string } = { decimal: '0.1337' };

  const unsignedTransaction = Pact.modules.coin
    .transfer(
      senderAccount,
      receiverAccount,
      // () => '(read-keyset "ks")',
      amount,
    )
    // .addData({
    //   ks: {
    //     keys: [onlyKey(receiverAccount)],
    //     pred: 'keys-all',
    //   },
    // })
    .addCap(
      'coin.TRANSFER',
      onlyKey(senderAccount),
      senderAccount,
      receiverAccount,
      amount,
    )
    .addCap('coin.GAS', onlyKey(senderAccount))
    .setMeta({ sender: senderAccount }, 'testnet04');

  const res = await signWithChainweaver(unsignedTransaction);

  console.log('sigs', res[0].sigs);
  console.log('signed transactions', JSON.stringify(res, null, 2));

  const sendRequests = res.map((tx) => {
    console.log('sending transaction', tx.code);
    return tx.send(testnetChain1ApiHost);
  });

  const sendResponses = await Promise.all(sendRequests);
  sendResponses.map(async function startPolling(
    sendResponse: SendResponse,
  ): Promise<void> {
    console.log('sendResponse', sendResponse);
    const requestKey = (await sendRequests[0]).requestKeys[0];
    await pollMain(requestKey);
  });
}

async function pollMain(...requestKeys: string[]): Promise<void> {
  if (requestKeys.length === 0) {
    console.log('function called without arguments');
    return;
  }

  console.log(`polling for ${requestKeys.join(',')}`);
  const pollResponse = await poll(
    {
      requestKeys,
    },
    testnetChain1ApiHost,
  );

  if (Object.keys(pollResponse).length === 0) {
    console.log('no transaction found yet');
    setTimeout(() => pollMain(...requestKeys), 5000);
  } else {
    console.log('found transaction');
    const foundRequestKeys: string[] = [];
    Object.keys(pollResponse).forEach((requestKey) => {
      console.log(
        `${requestKey} poll response`,
        JSON.stringify(pollResponse[requestKey], undefined, 2),
      );
      foundRequestKeys.push(requestKey);
    });

    await pollMain(
      ...requestKeys.filter((k) => !foundRequestKeys.some((fk) => fk === k)),
    );
  }
}

async function getBalanceMain() {
  const res = await Pact.modules.coin['get-balance'](
    'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94',
  )
    .setMeta({ sender: '', chainId: '10' })
    .local(testnetChain1ApiHost);
  console.log(res);
}

transactionMain().catch(console.error);
// pollMain('OXnoT0dDMQRKjrDDo4UHYr4u71Uo7Ry9Eb_1V9za6vM').catch(console.error);
// getBalanceMain().catch(console.error);
