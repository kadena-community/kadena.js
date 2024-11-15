import type { INetwork } from '@/components/NetworkProvider/NetworkProvider';
import { ADMIN } from '@/constants';
import { getPubKey } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';
import type { ConnectedAccount } from '@kadena/spirekey-sdk';
import { sign } from '@kadena/spirekey-sdk';

export interface IInitTokenProps {
  name: string;
  symbol: string;
  kadenaId: string;
}

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

export const initToken = async (
  data: IInitTokenProps,
  network: INetwork,
  owner: ConnectedAccount,
) => {
  console.log({ owner });
  const transaction = Pact.builder
    .execution(
      `
      (RWA.agent-role.init (read-keyset 'owner_guard))
      (RWA.identity-registry.init RWA.agent-role)
      (RWA.mvp-token.init "mvp-token2" "MVP2" 0 "kadenaID2" "0.0" RWA.agent-role RWA.max-balance-compliance RWA.identity-registry false)
      (RWA.max-balance-compliance.init)
      `,
    )
    .setMeta({
      senderAccount: owner.accountName,
      chainId: network.chainId,
    })
    .addSigner(
      {
        pubKey: getPubKey(owner!),
        scheme: 'WebAuthn',
      },
      (withCap) => [],
    )
    .addSigner(ADMIN.publicKey, (withCap) => [])
    .addData('owner_guard', {
      keys: [ADMIN.publicKey],
      pred: 'keys-all',
    })
    .setNetworkId(network.networkId)
    .createTransaction();

  console.log({ transaction });
  console.log({ cmd: JSON.parse(transaction.cmd) });
  const { transactions } = await sign([transaction], [owner]);
  // console.log(res);
  console.log({ transactions });
  // transactions.map(async (t) => {
  //   // should perform check to see if all sigs are present

  //   console.log({ t });
  //   await doSubmit(t);
  // });
};
