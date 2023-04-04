// import { Pact, signWithChainweaver } from '@kadena/client';
// import { IPactDecimal } from '@kadena/types';

// import { testnetChain1ApiHost } from './util/host';
// import { keyFromAccount } from './util/keyFromAccount';

// async function transfer(
//   sender: string,
//   receiver: string,
//   amount: IPactDecimal,
//   host: string,
// ): Promise<void> {

//   // Pact.modules.coin.transfer() // { command: "(coin.transfer from to 10.00001) (coin.transfer to from 0.00001)" }
//   const builderWith3Cmds = createTransactionFunctional(
//     Pact.modules.coin.transfer('from', 'to', { decimal: '1.00001' }),
//     Pact.modules.coin['transfer-create'](),
//     Pact.modules.coin.transfer(),
//   );

//   const builderWith3CmdAndCaps = builderWith3Cmds
//     |> addCap('', sender)
//     |> addCap('coin.TRANSFER', sender, from, to, amount)

//   const stap2 = addCap(builderWith3Cmds, ''
//     sender,
//   );
//   addCap(stap2, '')

//   const builder = getTransactionBuilder(
//     Pact.modules.coin.transfer('from', 'to', { decimal: '1.00001' }),
//     Pact.modules.coin['transfer-create'](),
//     Pact.modules.coin.transfer(),
//   );

//   builder.addCap('');

//   Pact.modules.coin.transfer // pact expression generator
//   const builder = createCustomTransactionBuilder(`(coin.transfer)`) (creates untyped `builder`)
//   const builder = createTransactionBuilder(pactExpressions, pe2, pe3)
//   const builder = builder. // returns only the builder with functions, all properties are private
//     // addCap  // based on expressions' required caps
//     // addData
//     // setMeta
//   const tx = builder.createTransaction() // vanilla transaction { code: string, meta: {}, ... }
//   const partiallyOrFullySignedTx = signWithX(tx)
//                                   signWithX will be able to use a util function
//                                   to do `addSignatures` on the vanilla transaction
//   const sentTransaction = await send(partiallyOrFullySignedTx)
//   const sentTransactionFinished = await sendAndPollUntil(partiallyOrFullySignedTx)

//   pollUntil(partiallyOrFullySignedTx | sentTransaction).then
//       // pollUntil should work with two types.
//       // - One uses the hash, the other the requestKey

//   // Creating a transaction is a 3 step process before it can be send to the bc:
//   // pact code -> getTransactionBuilder
//   // transaction-builder -> finalizeTransaction
//   // (partially) signed transaction
//   //    -> sign/
//   //    -> send/local/poll/pollUntil (promises side-effect free)
//   //    -> continue

//   const signedTx = signWithChainweaver(builder)
//   signedTx

//     const finalTransaciton = finalize(builder)
//     finalTransaciton.send()

//     Pact.modules.coin.transfer

//   Pact.modules.coin.transfer('', '', { decimal: '' }).addCap('');

//   const builder = Pact.modules.coin
//     .transfer(sender, receiver, amount)
//     .addCap('coin.GAS', keyFromAccount(sender))
//     .addCap('coin.TRANSFER', keyFromAccount(sender), sender, receiver, amount)
//     .setMeta({ sender: keyFromAccount(sender) }, 'testnet04');

//   console.log('SigData', JSON.stringify(builder.createCommand().cmd));

//   // or use signWithChainweaver
//   const signatures = await signWithChainweaver(builder);
//   console.log('transation.sigs', JSON.stringify(signatures[0].sigs, null, 2));

//   // once signed we can send it to the blockchain
// }

// const myAccount: string =
//   'k:554754f48b16df24b552f6832dda090642ed9658559fef9f3ee1bb4637ea7c94';
// const receiver: string = 'albert';

// transfer(myAccount, receiver, { decimal: '10' }, testnetChain1ApiHost).catch(
//   console.error,
// );

interface OverloadFns {
  'transfer-crosschain'(
    sender: string,
    receiver: string,
    receiver_guard: Function,
    target_chain: string,
    amount: number,
  ): any;
  'transfer-crosschain'(
    pactId: string,
    step: TransferCrosschainSteps,
    rollback: boolean,
    proof: string, // TODO figure out whether it can be determined from pact
  ): any;
}

interface XChainFns {
  'transfer-crosschain': {
    exec: (
      sender: string,
      receiver: string,
      receiver_guard: Function,
      target_chain: string,
      amount: number,
    ) => any;
    cont: (
      pactId: string,
      step: TransferCrosschainSteps,
      rollback: boolean,
      proof: string, // TODO figure out whether it can be determined from pact
    ) => any;
  };
}

const overloadFns = {} as any as OverloadFns;

overloadFns['transfer-crosschain']('sender', 'rec', () => {}, '03', 10);
overloadFns['transfer-crosschain']('02934', 2, false, '');

type TransferCrosschainSteps = 1 | 2 | 3;

const xchainFns = {} as any as XChainFns;
xchainFns['transfer-crosschain'].exec('sender', 'rec', () => {}, '03', 10);
xchainFns['transfer-crosschain'].cont('02934', 2, false, '');

interface HybridTransferXChain {
  (
    sender: string,
    receiver: string,
    receiver_guard: Function,
    target_chain: string,
    amount: number,
  ): any;
  cont(
    pactId: string,
    step: TransferCrosschainSteps,
    rollback: boolean,
    proof: string, // TODO figure out whether it can be determined from pact
  ): any;
}

const transferXChainHybrid: HybridTransferXChain =
  {} as any as HybridTransferXChain;
transferXChainHybrid('sender', 'rec', () => {}, '03', 10);
transferXChainHybrid.cont('02934', 1, false, '');
