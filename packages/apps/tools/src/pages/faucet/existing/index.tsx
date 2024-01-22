import type { FormStatus } from '@/components/Global';
import { ChainSelect, FormStatusNotification } from '@/components/Global';
import AccountNameField, {
  NAME_VALIDATION,
} from '@/components/Global/AccountNameField';
import { menuData } from '@/constants/side-menu-items';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useToolbar } from '@/context/layout-context';
import { usePersistentChainID } from '@/hooks';
import { fundExistingAccount } from '@/services/faucet';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ICommandResult } from '@kadena/chainweb-node-client';
import {
  Box,
  Breadcrumbs,
  BreadcrumbsItem,
  Button,
  Card,
  Heading,
  Notification,
  NotificationHeading,
  Stack,
  SystemIcon,
} from '@kadena/react-ui';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  accountNameContainerClass,
  buttonContainerClass,
  chainSelectContainerClass,
  containerClass,
  inputContainerClass,
  notificationContainerStyle,
} from '../styles.css';

const schema = z.object({
  name: NAME_VALIDATION,
});

type FormData = z.infer<typeof schema>;

const AMOUNT_OF_COINS_FUNDED: number = 100;

const isCustomError = (error: unknown): error is ICommandResult => {
  return error !== null && typeof error === 'object' && 'result' in error;
};

interface IFundExistingAccountResponseBody {
  result: {
    status: string;
    error:
      | undefined
      | {
          message: string;
        };
  };
}

interface IFundExistingAccountResponse
  extends Record<string, IFundExistingAccountResponseBody> {}

const ExistingAccountFaucetPage: FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { selectedNetwork } = useWalletConnectClient();

  const [chainID, onChainSelectChange] = usePersistentChainID();

  const [requestStatus, setRequestStatus] = useState<{
    status: FormStatus;
    message?: string;
  }>({ status: 'idle' });

  useToolbar(menuData, router.pathname);

  const onFormSubmit = useCallback(
    async (data: FormData) => {
      setRequestStatus({ status: 'processing' });

      try {
        const result = (await fundExistingAccount(
          data.name,
          chainID,
          AMOUNT_OF_COINS_FUNDED,
        )) as IFundExistingAccountResponse;

        const error = Object.values(result).find(
          (response) => response.result.status === 'failure',
        );

        if (error) {
          setRequestStatus({
            status: 'erroneous',
            message: error.result.error?.message || t('An error occurred.'),
          });
          return;
        }

        setRequestStatus({ status: 'successful' });
      } catch (err) {
        let message;

        if (isCustomError(err)) {
          const result = err.result;
          const status = result?.status;
          if (status === 'failure') {
            message = (result.error as { message: string }).message;
          }
        } else if (err instanceof Error) {
          message = err.message;
        } else {
          message = String(err);
        }

        setRequestStatus({ status: 'erroneous', message });
      }
    },
    [chainID, t],
  );

  const mainnetSelected: boolean = selectedNetwork === 'mainnet01';
  const disabledButton: boolean =
    requestStatus.status === 'processing' || mainnetSelected;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <section className={containerClass}>
      <Head>
        <title>Kadena Developer Tools - Faucet</title>
      </Head>
      <Breadcrumbs>
        <BreadcrumbsItem>{t('Faucet')}</BreadcrumbsItem>
        <BreadcrumbsItem>{t('Existing')}</BreadcrumbsItem>
      </Breadcrumbs>
      <Heading as="h4">{t('Add Funds to Existing Account')}</Heading>
      <div className={notificationContainerStyle}>
        {mainnetSelected ? (
          <Notification intent="warning" role="status">
            <NotificationHeading>
              {t('The Faucet is not available on Mainnet')}
            </NotificationHeading>
            <Trans
              i18nKey="common:faucet-unavailable-warning"
              components={[
                <Link
                  href="/transactions/module-explorer?module=user.coin-faucet&chain=1"
                  key="link-to-module-explorer"
                />,
              ]}
            />
          </Notification>
        ) : null}
      </div>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <FormStatusNotification
          status={requestStatus.status}
          statusBodies={{
            successful: t('The coins have been funded to the given account.'),
          }}
          body={requestStatus.message}
        />
        <Stack flexDirection="column" gap="lg">
          <Card fullWidth>
            <Heading as="h5">{t('Account')}</Heading>
            <Box marginBlockEnd="md" />
            <div className={inputContainerClass}>
              <div className={accountNameContainerClass}>
                <AccountNameField
                  inputProps={register('name')}
                  error={errors.name}
                  label={t('The account name to fund coins to')}
                />
              </div>
              <div className={chainSelectContainerClass}>
                <ChainSelect
                  onChange={onChainSelectChange}
                  value={chainID}
                  ariaLabel="Select Chain ID"
                />
              </div>
            </div>
          </Card>
          <div className={buttonContainerClass}>
            <Button
              isLoading={requestStatus.status === 'processing'}
              endIcon={<SystemIcon.TrailingIcon />}
              title={t('Fund X Coins', { amount: AMOUNT_OF_COINS_FUNDED })}
              isDisabled={disabledButton}
              type="submit"
            >
              {t('Fund X Coins', { amount: AMOUNT_OF_COINS_FUNDED })}
            </Button>
          </div>
        </Stack>
      </form>
    </section>
  );
};

export default ExistingAccountFaucetPage;
