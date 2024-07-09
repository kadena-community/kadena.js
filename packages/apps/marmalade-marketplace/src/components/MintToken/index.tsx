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

function MintTokenComponent() {
  const router = useRouter();
  const { account } = useAccount();

  const [walletKey, setWalletKey] = useState<string>('');
  const [walletAccount, setWalletAccount] = useState('');

  useEffect(() => {
    if (account) {
      setWalletKey(account.credentials[0].publicKey);
      setWalletAccount(account.accountName);
    }
  }, [account]);

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

      const amountFormatted = (amount === 1) ? {"decimal": "1"} : new PactNumber(amount).toPactDecimal();
      await mintToken({
        policyConfig: checkPolicies(res.policies),
        tokenId: tokenId,
        accountName: walletAccount,
        guard: {
          account: walletAccount,
          keyset: {
            keys: [walletKey],
            pred: 'keys-all' as const,
          },
        },
        amount: amountFormatted,
        chainId: config.chainId as ChainId,
        capabilities: generateSpireKeyGasCapability(walletAccount)
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
        <Stack flex={1} flexDirection="column">
          <div className={styles.twoColumnRow}>
            <div className={styles.oneColumnRow}>
              <div className={styles.formSection}>
                <div className={styles.verticalForm}>
                  <Heading as="h5" className={styles.formHeading}>Token Information</Heading>
                  <br />
                  <TextField label="Token ID" name="tokenId" value={tokenId} onChange={handleTokenInputChange} />
                  <NumberField label="Amount" value={amount} onValueChange={hanldeAmountInputChange} />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.buttonRow}>
            <Button type="submit" onClick={handleButtonClick}>
              Mint Token
            </Button>
          </div>
          {result && (
            <div className={styles.resultBox}>
              <p>Token Policy Information: {JSON.stringify(result)}</p>
            </div>
          )}
          {error && (
            <div className={styles.errorBox}>
              <p>Error: {error}</p>
            </div>
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
