import type { INetwork } from '@/components/NetworkProvider/NetworkProvider';
import { ADMIN } from '@/constants';
import { Pact } from '@kadena/client';
import type { ConnectedAccount } from '@kadena/spirekey-sdk';

export interface IAddAgentProps {
  agent: string;
}

const createPubKeyFromAccount = (account: string): string => {
  return account.replace('k:', '').replace('r:', '');
};

// const doSubmit = async (txArg: any) => {
//   const client = getClient();

//   // try {
//   console.log(1);
//   const res = await client.submit(txArg);
//   console.log({ res });
//   //     return;
//   //   } catch (err: any) {
//   //     console.log(err);
//   //   }
// };

export const addAgent = async (
  data: IAddAgentProps,
  network: INetwork,
  account: ConnectedAccount,
) => {
  const transaction = Pact.builder
    .execution(
      `(RWA.agent-role.add-agent (read-string 'agent) (read-keyset 'agent_guard))`,
    )
    .setMeta({
      senderAccount: ADMIN.account,
      chainId: network.chainId,
    })
    .addSigner(ADMIN.publicKey, (withCap) => [
      withCap(`RWA.agent-role.ONLY-OWNER`),
      withCap(`coin.GAS`),
    ])
    .addData('agent', data.agent)
    .addData('agent_guard', {
      keys: [createPubKeyFromAccount(data.agent)],
      pred: 'keys-all',
    })

    .setNetworkId(network.networkId)
    .createTransaction();

  console.log({ transaction });
  console.log(transaction.cmd);
  console.log(JSON.parse(transaction.cmd));

  // const { transactions, isReady } = await sign([transaction], [account]);
  // await isReady();
  // console.log(transactions);

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  // transactions.map(async (t) => {
  //   await doSubmit(t);
  // });
};
