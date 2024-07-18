import React, { FormEvent, useState, useEffect} from 'react';
import { env } from '@/utils/env';
import * as styles from '@/styles/create-token.css';
import { useRouter } from 'next/navigation';
import { Stack, Heading, Button, TextField, NumberField } from '@kadena/kode-ui';
import { ChainId, BuiltInPredicate } from '@kadena/client';
import { getTokenInfo, mintToken } from '@kadena/client-utils/marmalade';
import { useAccount } from '@/hooks/account';
import { createSignWithSpireKey } from '@/utils/signWithSpireKey';
import SendTransaction from '@/components/SendTransaction';
import { useTransaction } from '@/hooks/transaction';
import { generateSpireKeyGasCapability, checkPolicies, Policy } from '@/utils/helper';
import { PactNumber } from "@kadena/pactjs";
import { MonoAutoFixHigh, MonoAccountBalanceWallet, MonoAccessTime } from '@kadena/kode-icons';

import CrudCard from '@/components/CrudCard';

function MintTokenComponent() {
  const router = useRouter();
  const { account, webauthnAccount } = useAccount();

  const { transaction, send, preview, poll } = useTransaction();
  const [tokenId, setTokenId] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<object>({});

  const config = {
    host: env.URL,
    networkId: env.NETWORKID,
    chainId: '8' as ChainId,
    sign: createSignWithSpireKey(router, { host: env.WALLET_URL ?? '' }),
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const res = await getTokenInfo({
        tokenId,
        networkId: config.networkId,
        chainId: config.chainId,
        host: config.host,
      }) as { policies: Policy[] };
      setResult( checkPolicies(res.policies))

      const amountFormatted = (amount === 1) ? {"decimal": "1.0"} : new PactNumber(amount).toPactDecimal();

      if (!webauthnAccount) {
        throw new Error("Webauthn account not found");
      }

      const walletAccount = account?.accountName || '';

      await mintToken({
        policyConfig: checkPolicies(res.policies),
        tokenId: tokenId,
        accountName: webauthnAccount?.account || "",
        guard: {
          account: webauthnAccount.account,
          keyset: webauthnAccount.guard
        },
        amount: amountFormatted,
        chainId: config.chainId as ChainId,
        capabilities: generateSpireKeyGasCapability(walletAccount),
        meta: {senderAccount: walletAccount}
      },
      {
        ...config,
        defaults: { networkId: config.networkId, meta: { chainId: config.chainId } },
      }).execute();
    } catch (error) {
      console.log(error)
      setError(error?.message);
    }
  };

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    handleSubmit(event as unknown as FormEvent);
  };

  const handleTokenInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'tokenId') setTokenId(value);
  };

  const hanldeAmountInputChange = (value: number) => {
    if (value >= 0) {
      setAmount(value);
    }
  }

  return (
    <>
      {!transaction ? (
        <Stack flex={1} flexDirection="column"  className={styles.container}>
          <CrudCard
            headingSize="h3"
            titleIcon={<MonoAutoFixHigh />}
            title="Mint Token"
            description={[
              "Mint a new token",
              "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi",
              "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore",
              "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia"
            ]}
          >
          <TextField label="Token ID" name="tokenId" value={tokenId} onChange={handleTokenInputChange} />
          <NumberField label="Amount" value={amount} onValueChange={hanldeAmountInputChange} />

        </CrudCard>

        <div className={styles.buttonRow}>
          <Button type="submit" onClick={handleButtonClick}>
            Mint Token
          </Button>
        </div>
        {result && (<CrudCard
          title="Token Policy Information"
          description={[
            "Displays the token policy information",
          ]}>
            <p>Token Policy Information: {JSON.stringify(result)}</p>
        </CrudCard>
        )}
      </Stack>
      ) : (
        <SendTransaction send={send} preview={preview} poll={poll} transaction={transaction} />
      )}
    </>
  );
}

export default function MintToken() {
  return <MintTokenComponent />;
}
