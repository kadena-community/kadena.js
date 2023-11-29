import { ChainSelect } from '@/components/Global';
import AccountNameField, {
  NAME_VALIDATION,
} from '@/components/Global/AccountNameField';
import { menuData } from '@/constants/side-menu-items';
import { useToolbar } from '@/context/layout-context';
import { buttonContainerClass } from '@/pages/faucet/existing/styles.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { CHAINS } from '@kadena/chainweb-node-client';
import {
  Breadcrumbs,
  Button,
  Card,
  Heading,
  TextField,
} from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { containerClass } from '../styles.css';

import AppBtc from '@ledgerhq/hw-app-btc';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { listen } from '@ledgerhq/logs';

const schema = z.object({
  receiver: NAME_VALIDATION,
  amount: z.number().positive(),
  receiverChainId: z.enum(CHAINS),
});

type FormData = z.infer<typeof schema>;

async function connectLedger() {
  try {
    const transport = await TransportWebHID.create();

    //listen to the events which are sent by the Ledger packages in order to debug the app
    listen((log) => console.log('Ledger listen:', log));

    //When the Ledger device connected it is trying to display the bitcoin address
    const appBtc = new AppBtc({ transport });
    const { bitcoinAddress } = await appBtc.getWalletPublicKey(
      "44'/0'/0'/0/0",
      { verify: false, format: 'legacy' },
    );

    console.log('BitcoinAddress:', bitcoinAddress);

    //Display the address on the Ledger device and ask to verify the address
    const walletPublicKey = await appBtc.getWalletPublicKey("44'/0'/0'/0/0", {
      format: 'legacy',
      verify: true,
    });

    console.log('WalletPublicKey:', walletPublicKey);
  } catch (error) {
    console.log(
      'Something went wrong with the Ledger device connection',
      error,
    );
  }
}

const LedgerPage = () => {
  const router = useRouter();
  useToolbar(menuData, router.pathname);
  const { t } = useTranslation('common');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { receiverChainId: CHAINS[0] },
  });

  const onSubmit = (data: FormData) => console.log('onsubmit', data);

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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card fullWidth>
          <Button onClick={connectLedger} type="button">
            Connect your Ledger
          </Button>
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
