'use client';
import { useAccount } from '@/hooks/account';
import { getClient } from '@/utils/client';
import { env } from '@/utils/env';
import { createTransaction, Pact } from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
  setNetworkId,
} from '@kadena/client/fp';
import { genKeyPair } from '@kadena/cryptography-utils';
import { Button } from '@kadena/kode-ui';
import { PactNumber } from '@kadena/pactjs';
import { sign } from '@kadena/spirekey-sdk';

const Home = () => {
  const { account } = useAccount();

  const handleCreateAsset = async () => {
    const client = getClient();

    console.log({ account });
    const transaction = Pact.builder
      .execution(
        `(RWA.agent-role.init (read-keyset 'owner_guard))
        (RWA.identity-registry.init RWA.agent-role)
        (RWA.mvp-token.init
          "mvp-token"
          "MVP"
          0
          "kadenaID"
          "0.0"
          RWA.agent-role
          RWA.max-balance-compliance 
          RWA.identity-registry 
          false
          )
          (RWA.max-balance-compliance.init)
      `,
      )
      .addData('owner_guard', {
        keys: [
          '8c806f9f6470a199718ba7bf336fb6c5723be132e2e6c0448f5fd7dff45e3386',
        ],
        pred: 'keys-all',
      })
      .addSigner(
        'af9b8d9448c68b81519cda4879dab5308f3c5facef450ead7d45534ae1d257f8',
      )
      .addSigner(
        '8c806f9f6470a199718ba7bf336fb6c5723be132e2e6c0448f5fd7dff45e3386',
      )

      .setMeta({
        sender:
          'k:af9b8d9448c68b81519cda4879dab5308f3c5facef450ead7d45534ae1d257f8',
        chainId: env.CHAINID,
      })
      .setNetworkId(env.NETWORKID)
      .createTransaction();

    console.log({ transaction });
    console.log(JSON.parse(transaction.cmd));

    const { transactions, isReady } = await sign([transaction], [account]);
    console.log({ transactions });
    await isReady();

    const { result } = await client.local(transaction, {
      preflight: false,
      signatureVerification: false,
    });

    console.log(result);
  };
  const handleCheckBalance = async () => {
    console.log(account);

    const amount = 20;
    const faucetAccount = account?.accountName;
    const signerKeys = [genKeyPair()];
    const contract = 'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet';

    const client = getClient();

    //     account: k:8c806f9f6470a199718ba7bf336fb6c5723be132e2e6c0448f5fd7dff45e3386
    // key:owner: 8c806f9f6470a199718ba7bf336fb6c5723be132e2e6c0448f5fd7dff45e3386

    const transaction = Pact.builder
      .execution(
        Pact.modules['RWA.agent-role']['add-agent'](
          "(read-string 'agent)",
          "(read-keyset 'agent_guard)",
        ),
      )
      .setMeta({
        chainId: env.CHAINID,
      })
      .addSigner(
        '8c806f9f6470a199718ba7bf336fb6c5723be132e2e6c0448f5fd7dff45e3386',
        (withCap) => [withCap(`RWA.agent-role.ONLY-OWNER`)],
      )
      .addSigner(
        'af9b8d9448c68b81519cda4879dab5308f3c5facef450ead7d45534ae1d257f8',
        (withCap) => [withCap(`coin.GAS`)],
      )
      .addData(
        'agent',
        'k:929e05b703e610a1a85b2cbe22d449ef787bc02ef00b1a62c868b41820eee5ef',
      )
      .addData('agent_guard', {
        key: '929e05b703e610a1a85b2cbe22d449ef787bc02ef00b1a62c868b41820eee5ef',
        pred: 'keys-all',
      })
      .setNetworkId(env.NETWORKID)
      .createTransaction();

    const { result } = await client.local(transaction, {
      preflight: false,
      signatureVerification: false,
    });

    console.log(result);

    // const transaction = composePactCommand(
    //   execution(
    //     Pact.modules[
    //       contract as 'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet'
    //     ]['request-coin'](
    //       account?.accountName,
    //       new PactNumber(amount).toPactDecimal(),
    //     ),
    //   ),
    //   addSigner(signerKeys, (signFor) => [
    //     signFor(
    //       // @ts-ignore
    //       `${contract as 'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49.coin-faucet'}.GAS_PAYER`,
    //       account,
    //       { int: 1 },
    //       { decimal: '1.0' },
    //     ),
    //     signFor(
    //       'coin.TRANSFER',
    //       faucetAccount,
    //       account,
    //       new PactNumber(amount).toPactDecimal(),
    //     ),
    //   ]),
    //   setMeta({ senderAccount: faucetAccount, chainId: env.CHAINID }),
    //   setNetworkId(env.NETWORKID),
    // );

    // console.log({ transaction });
    // const tx = createTransaction(transaction());

    // console.log({ tx });
    // const { transactions, isReady } = await sign([tx], [account?.accountName]);

    // console.log({ transactions });
    // await isReady();
  };

  return (
    <div>
      <Button onClick={handleCheckBalance}>CheckBalance</Button>
      <Button onClick={handleCreateAsset}>Create Agent</Button>
    </div>
  );
};

export default Home;
