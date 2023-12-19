import { ChainSelect } from '@/components/Global';
import { AccountHoverTag } from '@/components/Global/AccountHoverTag';
import AccountNameField, {
  NAME_VALIDATION,
} from '@/components/Global/AccountNameField';
import { menuData } from '@/constants/side-menu-items';
import { useToolbar } from '@/context/layout-context';
import useAccountDetails from '@/hooks/use-account-details';
import useLedgerApp from '@/hooks/use-ledger-app';
import { buttonContainerClass } from '@/pages/faucet/existing/styles.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { CHAINS } from '@kadena/chainweb-node-client';
import { createSignWithLedger } from '@kadena/client';
import { transfer, transferCrossChain } from '@kadena/client-utils/coin';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Heading,
  Notification,
  Text,
  TextField,
} from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { containerClass } from '../styles.css';

const schema = z.object({
  receiver: NAME_VALIDATION,
  amount: z.number().positive(),
  receiverChainId: z.enum(CHAINS),
});

function bufferToHex(buffer: Uint8Array) {
  return [...buffer]
    .map((b) => {
      return b.toString(16).padStart(2, '0');
    })
    .join('');
}

type FormData = z.infer<typeof schema>;

const LedgerPage = () => {
  const router = useRouter();
  useToolbar(menuData, router.pathname);
  const { t } = useTranslation('common');
  // const [publicKey, connectLedger] = useLedger();
  const { app, connect } = useLedgerApp();
  const [publicKey, setPublicKey] = useState<string>();

  useEffect(() => {
    if (!app) return;

    const keyId = '0';

    const getAddress = async () => {
      const kdaAddress = await app.getPublicKey(`m/44'/626'/${keyId}'/0/0`);

      console.log('kdaAddress:', {
        1: bufferToHex(kdaAddress.publicKey),
        // 2: bufferToHex(kdaAddress2.publicKey),
      });

      setPublicKey(bufferToHex(kdaAddress.publicKey));
    };

    // eslint-disable-next-line no-void
    void getAddress();
  }, [app]);

  console.log({ publicKey });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { receiverChainId: CHAINS[0] },
  });

  const watchReceiver = watch('receiver');
  const watchReceiverChainId = watch('receiverChainId');
  const receiver = useAccountDetails(
    watchReceiver,
    'testnet04',
    watchReceiverChainId,
  );

  const onSubmit = async (data: FormData) => {
    console.log('onsubmit', data);
    if (!publicKey) {
      console.log('Missing error key');
      return;
    }

    if (!app) {
      console.log('Make sure to connect your Ledger first!');
      return;
    }

    const result = await transfer(
      {
        sender: { account: `k:${publicKey}`, publicKeys: [publicKey] },
        receiver: data.receiver,
        // receiver: {
        //   account: data.receiver,
        //   // keyset: {
        //   //   keys: string[];
        //   //   pred: 'keys-all' | 'keys-2' | 'keys-any';
        //   // };
        // },
        amount: `${data.amount}`,
        // targetChainId: data.receiverChainId,
        chainId: data.receiverChainId,
      },
      {
        sign: createSignWithLedger(app),
        host: ({ networkId, chainId }) =>
          `https://api.testnet.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
        defaults: { networkId: 'testnet04' },
      },
    )
      .on('sign', (data) => console.log(data))
      .on('preflight', (data) => console.log(data))
      .on('submit', (data) => console.log(data))
      .on('listen', (data) => console.log(data))
      .execute();

    console.log('result', result);
  };

  return (
    <section className={containerClass}>
      <Head>
        <title>Kadena Developer Tools - Ledger</title>
      </Head>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item>{t('Transactions')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('Ledger')}</Breadcrumbs.Item>
      </Breadcrumbs.Root>
      <Heading as="h4">{t('Kadena Ledger Transfer')}</Heading>
      <Notification role="alert">
        Please visit{' '}
        <a
          href="https://support.ledger.com/hc/en-us/articles/7415959614109?docs=true"
          target="_blank"
          rel="noreferrer"
        >
          the Ledger docs
        </a>{' '}
        for more information.
      </Notification>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card fullWidth>
          <Button
            color={publicKey ? 'positive' : undefined}
            onClick={connect}
            type="button"
          >
            {publicKey ? 'Connected!' : 'Connect your Ledger'}
          </Button>
          <Box marginBottom={'$4'} />
          <Heading as="h5">{t('Sender')}</Heading>
          {/* <TextField
            disabled
            inputProps={{
              value: publicKey,
              id: 'ledger-public-key',
              placeholder: 'Connect with your ledger to fetch your key',
            }}
            label="Your Ledger public key"
          /> */}
          {publicKey ? (
            <AccountHoverTag value={publicKey.slice(0, 15)} />
          ) : (
            <Text as="code">Connect with your ledger to fetch your key</Text>
          )}
          <Box marginBottom={'$4'} />

          <Heading as="h5">{t('Receiver')}</Heading>
          <AccountNameField
            inputProps={{ ...register('receiver') }}
            error={errors.receiver}
          />
          <Controller
            name="receiverChainId"
            control={control}
            render={({ field }) => <ChainSelect {...field} />}
          />
          {/* <ChainSelect
            {...register('receiverChainId', { value: '13' })}
          /> */}
          <TextField
            inputProps={{
              ...register('amount', { valueAsNumber: true }),
              id: 'ledger-transfer-amount',
            }}
            status={errors.amount ? 'negative' : undefined}
            label="Amount"
            helperText={errors.amount?.message}
          />
        </Card>
        <div className={buttonContainerClass}>
          <Button
            // loading={requestStatus.status === 'processing'}
            icon="TrailingIcon"
            iconAlign="right"
            title={t('Sign with Ledger and Transfer')}
            // disabled={disabledButton}
          >
            {t('Sign with Ledger and Transfer')}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default LedgerPage;
