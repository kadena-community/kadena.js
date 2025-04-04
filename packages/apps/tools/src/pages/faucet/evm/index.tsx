import type { FormStatus } from '@/components/Global';
import {
  AccountNameField,
  ChainSelect,
  FormStatusNotification,
  NAME_VALIDATION,
} from '@/components/Global';
import { menuData } from '@/constants/side-menu-items';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useToolbar } from '@/context/layout-context';
import { getEVMProvider } from '@/utils/evm';
import { getExplorerLink } from '@/utils/getExplorerLink';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ChainId } from '@kadena/client';
import { MonoKeyboardArrowRight } from '@kadena/kode-icons/system';
import {
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  Card,
  Heading,
  Notification,
  NotificationHeading,
  Stack,
} from '@kadena/kode-ui';
import type { ethers } from 'ethers';
import { useReCaptcha } from 'next-recaptcha-v3';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  buttonContainerClass,
  containerClass,
  explorerLinkStyle,
} from '../styles.css';

const schema = z.object({
  name: NAME_VALIDATION,
});

type FormData = z.infer<typeof schema>;

const AMOUNT_OF_COINS_FUNDED: number = 20;
const TXHASH_LOCALSTORAGEKEY = 'TXHASH_LOCALSTORAGEKEY';

const ExistingAccountFaucetPage: FC = () => {
  const { executeRecaptcha } = useReCaptcha();
  const { t } = useTranslation('common');
  const router = useRouter();
  const { selectedNetwork, networksData } = useWalletConnectClient();
  const [chainId, setChainId] = useState<ChainId>('0');
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [requestStatus, setRequestStatus] = useState<{
    status: FormStatus;
    message?: string;
  }>({ status: 'idle' });

  const [requestKey, setRequestKey] = useState<string>('');

  useToolbar(menuData, router.pathname);

  const waitForTx = useCallback(async () => {
    const hash = localStorage.getItem(TXHASH_LOCALSTORAGEKEY);
    if (!hash) return;
    const tx = await getEVMProvider(chainId).getTransaction(hash);
    const receipt = await tx?.wait();

    localStorage.removeItem(TXHASH_LOCALSTORAGEKEY);

    if (receipt?.status !== 1) {
      setRequestStatus({
        status: 'erroneous',
        message: t('An error occurred.'),
      });
      return;
    }

    setRequestStatus({ status: 'successful' });
  }, [chainId, t]);

  const onFormSubmit = useCallback(
    async (data: FormData) => {
      setRequestStatus({ status: 'processing' });
      setRequestKey('');

      const token = await executeRecaptcha('form_submit');

      console.log({ token });
      const result: Response = await fetch(`/api/faucet/evm`, {
        method: 'POST',
        body: JSON.stringify({ ...data, chainId, token }),
      });

      const txData = (await result.json()) as ethers.TransactionResponse;

      if (!txData.hash) {
        setRequestStatus({
          status: 'erroneous',
          message: t('No tx returned'),
        });
        return;
      }

      localStorage.setItem(TXHASH_LOCALSTORAGEKEY, txData.hash);
      await waitForTx();
    },
    [chainId, t, waitForTx, executeRecaptcha],
  );

  const linkToExplorer = `${getExplorerLink(
    requestKey,
    selectedNetwork,
    networksData,
  )}`;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    waitForTx();
  }, [waitForTx]);

  return (
    <section className={containerClass}>
      <Head>
        <title>Kadena Developer Tools - EVM Faucet</title>
      </Head>
      <Breadcrumbs>
        <BreadcrumbsItem>{t('Faucet')}</BreadcrumbsItem>
        <BreadcrumbsItem>{t('Fund EVM Account')}</BreadcrumbsItem>
      </Breadcrumbs>

      <Stack
        as="form"
        onSubmit={handleSubmit(onFormSubmit)}
        gap="lg"
        width="100%"
        flexDirection="column"
      >
        <Heading as="h4">{t('Add Funds to EVM Account')}</Heading>

        <Notification intent="warning" role="status" type="inlineStacked">
          <NotificationHeading>
            {t('The EVM Faucet is only working while running a hardhat')}
          </NotificationHeading>
          <div>{t('On other networks this is not yet available')}</div>
        </Notification>

        <FormStatusNotification
          status={requestStatus.status}
          statusBodies={{
            successful: t('The coins have been funded to the given account.'),
          }}
          body={requestStatus.message}
        />
        <Stack flexDirection="column" gap="lg" width="100%">
          <Card fullWidth>
            <Stack width="100%" gap="lg">
              <AccountNameField
                {...register('name')}
                errorMessage={errors.name?.message}
                label={t('The account name to fund coins to')}
              />

              <ChainSelect
                onSelectionChange={setChainId}
                selectedKey={chainId}
                aria-label="Select Chain ID"
                chainCount={2}
              />
            </Stack>
          </Card>
          <div className={buttonContainerClass}>
            <Button
              ref={buttonRef}
              isLoading={requestStatus.status === 'processing'}
              endVisual={<MonoKeyboardArrowRight />}
              title={t('Fund X Coins', { amount: AMOUNT_OF_COINS_FUNDED })}
              type="submit"
            >
              {t('Fund X Coins', { amount: AMOUNT_OF_COINS_FUNDED })}
            </Button>
          </div>
        </Stack>

        {requestKey !== '' ? (
          <FormStatusNotification
            status={'processing'}
            title={t('Transaction submitted')}
            body={
              <Trans
                i18nKey="common:link-to-kadena-explorer"
                components={[
                  <Link
                    className={explorerLinkStyle}
                    href={linkToExplorer}
                    target={'_blank'}
                    key={requestKey}
                  >
                    {requestKey}
                  </Link>,
                ]}
              />
            }
          />
        ) : null}
      </Stack>
    </section>
  );
};

export default ExistingAccountFaucetPage;
