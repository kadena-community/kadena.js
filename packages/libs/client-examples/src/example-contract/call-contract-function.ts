import { Pact, createClient } from '@kadena/client';

const client = createClient();

const command = async (functionName: string) => {
  const unsignedTransaction = Pact.builder
    .execution(functionName)
    .setMeta({
      chainId: '1',
      gasLimit: 2500,
    })
    .setNetworkId('testnet04')
    .createTransaction();

  try {
    const res = await client.dirtyRead(unsignedTransaction);
    if (res.result.status === 'success') {
      console.log(res.result.data);
      return res.result.data;
    } else {
      console.log('No data returned:', res);
    }
  } catch (error) {
    console.error('Error with dirtyRead or data processing:', error);
  }

  try {
    const res = await client.dirtyRead(unsignedTransaction);
    if (res.result.status === 'success') {
      console.log(res.result.data);
      return res.result.data;
    } else {
      console.log('No data returned:', res);
    }
  } catch (error) {
    console.error('Error with dirtyRead or data processing:', error);
  }
};

command('(free.simplemodule.greet)').catch(console.error);
