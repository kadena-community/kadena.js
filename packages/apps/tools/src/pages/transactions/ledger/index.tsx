import {
  AccountNameField,
  ChainSelect,
  NAME_VALIDATION,
} from '@/components/Global';
import { menuData } from '@/constants/side-menu-items';
import { useToolbar } from '@/context/layout-context';
import useAccountDetails from '@/hooks/use-account-details';
import { buttonContainerClass } from '@/pages/faucet/styles.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { CHAINS } from '@kadena/chainweb-node-client';
import { createSignWithLedger } from '@kadena/client';
import { transfer } from '@kadena/client-utils/coin';
import {
  Box,
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  Card,
  FormFieldHeader,
  Heading,
  Notification,
  Stack,
  SystemIcon,
  TextField,
} from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { containerClass } from '../styles.css';
import LedgerDetails from './ledger-details';

const schema = z.object({
  sender: NAME_VALIDATION,
  senderChainId: z.enum(CHAINS),
  receiver: NAME_VALIDATION,
  amount: z.number().positive(),
  receiverChainId: z.enum(CHAINS),
});

type FormData = z.infer<typeof schema>;

const LedgerPage = () => {
  const router = useRouter();
  useToolbar(menuData, router.pathname);
  const { t } = useTranslation('common');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { senderChainId: CHAINS[0], receiverChainId: CHAINS[0] },
  });

  const watchReceiver = watch('receiver');
  const watchReceiverChainId = watch('receiverChainId');
  const receiverQuery = useAccountDetails(
    watchReceiver,
    'testnet04',
    watchReceiverChainId,
  );
  const watchChains = watch(['senderChainId', 'receiverChainId']);
  const onSameChain = watchChains.every((chain) => chain === watchChains[0]);

  console.log('watchReceiver', {
    watchReceiver,
    watchReceiverChainId,
    watchChains,
    onSameChain,
  });

  console.log('receiver', receiverQuery);

  const publicKey: string = ''; // FIXME

  const onSubmit = async (data: FormData) => {
    console.log('onsubmit', data);

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
      .on('sign', (data) => console.log('transfer - sign', data))
      .on('preflight', (data) => console.log('transfer - preflight', data))
      .on('submit', (data) => console.log('transfer - submit', data))
      .on('listen', (data) => console.log('transfer - listen', data))
      .execute();

    console.log('result', result);
  };

  return (
    <section className={containerClass}>
      <Head>
        <title>Kadena Developer Tools - Ledger</title>
      </Head>
      <Breadcrumbs>
        <BreadcrumbsItem>{t('Transactions')}</BreadcrumbsItem>
        <BreadcrumbsItem>{t('Ledger')}</BreadcrumbsItem>
      </Breadcrumbs>
      <Heading as="h4">{t('Kadena Ledger Transfer')}</Heading>
      <Box marginBlockEnd="md">
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
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack flexDirection="column" gap="lg">
          <Card fullWidth>
            <Heading as="h5">{t('Sender')}</Heading>
            <Box marginBlockEnd="md" />
            <Stack
              flexDirection="column"
              justifyContent="flex-start"
              alignItems="stretch"
              gap="sm"
            >
              <FormFieldHeader label={t('Account')} />
              <LedgerDetails />
              <Controller
                name="senderChainId"
                control={control}
                render={({ field }) => <ChainSelect {...field} />}
              />
            </Stack>
          </Card>
          <Card fullWidth>
            <Heading as="h5">{t('Receiver')}</Heading>
            <AccountNameField
              {...register('receiver')}
              errorMessage={errors.receiver?.message}
            />
            {/* <AccountDetails query={receiverQuery} /> */}
            <Controller
              name="receiverChainId"
              control={control}
              render={({ field }) => (
                <ChainSelect {...field} id="receiverChainId" />
              )}
            />
            <TextField
              {...register('amount', { valueAsNumber: true })}
              id="ledger-transfer-amount"
              label="Amount"
              isInvalid={!!errors.amount}
              errorMessage={errors.amount?.message}
              info="The amount of KDA to transfer."
            />
          </Card>
          <div className={buttonContainerClass}>
            <Button
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
              endIcon={<SystemIcon.TrailingIcon />}
              title={t('Sign with Ledger and Transfer')}
              type="submit"
            >
              {t('Sign with Ledger and Transfer')}
            </Button>
          </div>
        </Stack>
      </form>
    </section>
  );
};

export default LedgerPage;
