import { IUnsignedTransaction, Pact, signWithChainweaver } from '@kadena/client';

const sender: string = 'croesus';
const receiver: string =
  'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';
// const sender: string = receiver;
const senderNoK: string =
  '2993f795d133fa5d0fd877a641cabc8b28cd36147f666988cacbaa4379d1ff93';
// const senderNoK: string = sender.split('k:')[1];
const amount: number = 1000.0;
const data: { ks: { keys: string[]; pred: string } } = {
  ks: {
    keys: ['554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94'],
    pred: 'keys-all',
  },
};

const unsignedTransaction: IUnsignedTransaction = Pact.modules.coin[
  'transfer-create'
](sender, receiver, () => "(read-keyset 'ks)", amount)
  .addData(data)
  .addCap('coin.GAS', senderNoK)
  .addCap('coin.TRANSFER', senderNoK, sender, receiver, amount)
  .addMeta(
    {
      chainId: '1',
      gasLimit: 1000,
      sender: senderNoK,
      gasPrice: 1.0e-8,
      ttl: 60 * 10,
    },
    'testnet04',
  )
  .createTransaction();

// write numbers as decimal
// console.log(JSON.stringify(unsignedTransaction));

signWithChainweaver(unsignedTransaction)
  .then((res) => console.log('signed transaction: \n  ', res))
  .catch(console.error);
