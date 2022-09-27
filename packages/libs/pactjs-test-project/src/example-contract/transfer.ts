import {
  IUnsignedTransaction,
  Pact,
  signWithChainweaver,
} from '@kadena/client';

// send some kda
const senderAccount: string = 'your-account';
const receiverAccount: string =
  'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';
const senderPubkey: string =
  '554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';
const amount: number = 1000.0;
const data: { ks: { keys: string[]; pred: string } } = {
  ks: {
    keys: [senderPubkey],
    pred: 'keys-all',
  },
};

const unsignedTransaction: IUnsignedTransaction = Pact.modules.coin[
  'transfer-create'
](senderAccount, receiverAccount, () => "(read-keyset 'ks)", amount)
  .addData(data)
  .addCap('coin.GAS', senderPubkey)
  .addCap('coin.TRANSFER', senderPubkey, senderAccount, receiverAccount, amount)
  .setMeta(
    {
      sender: senderPubkey,
    },
    'testnet04',
  )
  .createTransaction();

// write numbers as decimal
// console.log(JSON.stringify(unsignedTransaction));

signWithChainweaver(unsignedTransaction)
  .then((res) =>
    console.log('signed transaction: \n  ', JSON.stringify(res, null, 2)),
  )
  .catch(console.error);
