import type { INetwork } from '@/components/NetworkProvider/NetworkProvider';
import type { ISecurityFormProps } from '@/components/SecurityForm/SecurityForm';
import { Pact } from '@kadena/client';
import type { ConnectedAccount } from '@kadena/spirekey-sdk';

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
      chainId: network.chainId,
    })
    .addSigner(
      'b9c116dbcbe98116c5fa4f23555696529a10883eed15de918252cb52af2f6a8a',
      (withCap) => [withCap(`RWA.agent-role.ONLY-OWNER`)],
    )
    .addSigner(
      '95620c7a69eb9a946ed70022264436d96d1073712f3eaff3cc6100396e84935a',
      (withCap) => [withCap(`coin.GAS`)],
    )
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

  //   const res = await sign([transaction], [owner]);
  //   console.log({ res });
};
