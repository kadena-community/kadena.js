import type { INetwork } from '@/components/NetworkProvider/NetworkProvider';
import type { ISecurityFormProps } from '@/components/SecurityForm/SecurityForm';
import { getClient } from '@/utils/client';
import { Pact } from '@kadena/client';
import type { ConnectedAccount } from '@kadena/spirekey-sdk';
import { sign } from '@kadena/spirekey-sdk';

const doSubmit = async (txArg: any) => {
  const client = getClient();

  // try {
  console.log(1);
  const res = await client.submit(txArg);
  console.log({ res });
  //     return;
  //   } catch (err: any) {
  //     console.log(err);
  //   }
};

export const createToken = async (
  data: ISecurityFormProps,
  network: INetwork,
  owner: ConnectedAccount,
) => {
  const transaction = Pact.builder
    .execution(
      `RWA.agent-role.add-agent (read-string 'agent) (read-keyset 'agent_guard)`,
    )
    .setMeta({
      senderAccount: owner.accountName,
      chainId: network.chainId,
    })
    .addSigner(owner.keyset?.keys[1]!, (withCap) => [
      withCap(`RWA.agent-role.ONLY-OWNER`),
      withCap(`coin.GAS`),
    ])
    .addData(
      'agent',
      'k:929e05b703e610a1a85b2cbe22d449ef787bc02ef00b1a62c868b41820eee5ef',
    )
    .addData('agent_guard', {
      keys: [
        '929e05b703e610a1a85b2cbe22d449ef787bc02ef00b1a62c868b41820eee5ef',
      ],
      pred: 'keys-all',
    })
    .setNetworkId(network.networkId)
    .createTransaction();

  console.log({ transaction });
  console.log(JSON.parse(transaction.cmd));

  const { transactions, isReady } = await sign([transaction], [owner]);
  await isReady();

  console.log({ transactions });
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  transactions.map(async (t) => {
    // should perform check to see if all sigs are present

    console.log({ t });
    await doSubmit(t);
  });
};
