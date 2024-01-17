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

import {
  hoverTagContainerStyle,
  iconButtonWrapper,
  inputWrapperStyle,
  notificationContentStyle,
  notificationLinkStyle,
  pubKeyInputWrapperStyle,
  pubKeysContainerStyle,
} from './styles.css';

import {
  accountNameContainerClass,
  buttonContainerClass,
  chainSelectContainerClass,
  containerClass,
  inputContainerClass,
  notificationContainerStyle,
} from '../styles.css';

import type { FormStatus } from '@/components/Global';
import { ChainSelect, FormStatusNotification } from '@/components/Global';
import { AccountHoverTag } from '@/components/Global/AccountHoverTag';
import AccountNameField from '@/components/Global/AccountNameField';
import { HoverTag } from '@/components/Global/HoverTag';
import type { PredKey } from '@/components/Global/PredKeysSelect';
import { PredKeysSelect } from '@/components/Global/PredKeysSelect';
import { PublicKeyField } from '@/components/Global/PublicKeyField';
import { menuData } from '@/constants/side-menu-items';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useToolbar } from '@/context/layout-context';
import { usePersistentChainID } from '@/hooks';
import { createPrincipal } from '@/services/faucet/create-principal';
import { fundCreateNewAccount } from '@/services/faucet/fund-create-new';
import { validatePublicKey } from '@/services/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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

const AMOUNT_OF_COINS_FUNDED: number = 100;
const isCustomError = (error: unknown): error is ICommandResult => {
  return error !== null && typeof error === 'object' && 'result' in error;
};

const schema = z.object({
  name: z.string(),
  pubKey: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const NewAccountFaucetPage: FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { selectedNetwork } = useWalletConnectClient();

  const [chainID, onChainSelectChange] = usePersistentChainID();
  const [pred, onPredSelectChange] = useState<PredKey>('keys-all');
  const [requestStatus, setRequestStatus] = useState<{
    status: FormStatus;
    message?: string;
  }>({ status: 'idle' });
  const [pubKeys, setPubKeys] = useState<string[]>([]);

  const { data: accountName } = useQuery({
    queryKey: ['accountName', pubKeys, chainID, pred],
    queryFn: () => createPrincipal(pubKeys, chainID, pred),
    enabled: pubKeys.length > 0,
    placeholderData: '',
    keepPreviousData: true,
  });

  useEffect(() => {
    setRequestStatus({ status: 'idle' });
  }, [pubKeys.length]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError,
    getValues,
    resetField,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    setValue('name', typeof accountName === 'string' ? accountName : '');
  }, [accountName, setValue]);

  useToolbar(menuData, router.pathname);

  const onFormSubmit = useCallback(
    async (data: FormData) => {
      if (!pubKeys.length) {
        setError('pubKey', {
          type: 'custom',
          message: t('add-key-reminder'),
        });
        return;
      }

      setRequestStatus({ status: 'processing' });
      try {
        const result = (await fundCreateNewAccount(
          data.name,
          pubKeys,
          chainID,
          AMOUNT_OF_COINS_FUNDED,
          pred,
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
    [chainID, pred, pubKeys, setError, t],
  );

  const mainnetSelected: boolean = selectedNetwork === 'mainnet01';
  const disabledButton: boolean =
    requestStatus.status === 'processing' || mainnetSelected;

  const addPublicKey = () => {
    const value = getValues('pubKey');

    const copyPubKeys = [...pubKeys];
    const isDuplicate = copyPubKeys.includes(value!);

    if (isDuplicate) {
      setError('pubKey', { message: t('Duplicate public key') });
      return;
    }

    copyPubKeys.push(value!);
    setPubKeys(copyPubKeys);
    resetField('pubKey');
  };

  const deletePublicKey = (index: number) => {
    const copyPubKeys = [...pubKeys];
    copyPubKeys.splice(index, 1);

    setPubKeys(copyPubKeys);
  };

  const renderPubKeys = () => (
    <div className={pubKeysContainerStyle}>
      {pubKeys.map((key, index) => (
        <HoverTag
          key={`public-key-${key}`}
          value={key}
          onIconButtonClick={() => {
            deletePublicKey(index);
          }}
          icon="TrashCan"
          maskOptions={{ headLength: 4 }}
        />
      ))}
    </div>
  );

  return (
    <section className={containerClass}>
      <Head>
        <title>Kadena Developer Tools - Faucet</title>
      </Head>
      <Breadcrumbs>
        <BreadcrumbsItem>{t('Faucet')}</BreadcrumbsItem>
        <BreadcrumbsItem>{t('New')}</BreadcrumbsItem>
      </Breadcrumbs>{' '}
      <Heading as="h4">{t('Create and Fund New Account')}</Heading>
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
      <div className={notificationContainerStyle}>
        <Notification intent="warning" role="none">
          <NotificationHeading>{t(`Before you start`)}</NotificationHeading>
          <Trans
            i18nKey="common:faucet-how-to-start"
            components={[
              <a
                className={notificationLinkStyle}
                target={'_blank'}
                href={'https://transfer.chainweb.com/'}
                rel="noreferrer"
                key="chainweb-transfer-link"
              />,
              <a
                className={notificationLinkStyle}
                target={'_blank'}
                href={'https://kadena.io/chainweaver-tos/'}
                rel="noreferrer"
                key="chainweaver-link"
              />,
              <p key="text-wrapper" />,
              <Link
                className={notificationLinkStyle}
                href={'/faucet/existing'}
                key="faucet-existing-link"
              />,
            ]}
          />
        </Notification>
      </div>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <FormStatusNotification
          status={requestStatus.status}
          statusBodies={{
            successful: (
              <span className={notificationContentStyle}>
                {`${AMOUNT_OF_COINS_FUNDED} ${t('coins have been funded to')}`}
                <span className={hoverTagContainerStyle}>
                  <AccountHoverTag value={accountName as string} />
                </span>
              </span>
            ),
          }}
          body={requestStatus.message}
        />
        <Stack flexDirection="column" gap="lg">
          <Card fullWidth>
            <Heading as="h5">Public Keys</Heading>
            <Box marginBlockEnd="md" />

            <div className={pubKeyInputWrapperStyle}>
              <div className={inputWrapperStyle}>
                <PublicKeyField
                  helperText={errors?.pubKey?.message}
                  {...register('pubKey', {
                    onChange: () => {
                      clearErrors('pubKey');
                    },
                  })}
                  error={errors.pubKey}
                />
              </div>
              <div className={iconButtonWrapper}>
                <Button
                  icon={<SystemIcon.Plus />}
                  variant="text"
                  onPress={() => {
                    const value = getValues('pubKey');
                    const valid = validatePublicKey(value || '');
                    if (valid) {
                      addPublicKey();
                    } else {
                      setError('pubKey', {
                        type: 'custom',
                        message: t('invalid-pub-key-length'),
                      });
                    }
                  }}
                  aria-label="Add public key"
                  title="Add Public Key"
                  color="primary"
                  type="button"
                />
              </div>
            </div>

            {pubKeys.length > 0 ? renderPubKeys() : null}

            {pubKeys.length > 1 ? (
              <PredKeysSelect
                onChange={onPredSelectChange}
                value={pred}
                ariaLabel="Select Predicate"
              />
            ) : null}
          </Card>
          <Card fullWidth>
            <Heading as="h5">{t('Account')}</Heading>
            <Box marginBlockEnd="md" />
            <div className={inputContainerClass}>
              <div className={accountNameContainerClass}>
                <AccountNameField
                  inputProps={register('name')}
                  error={errors.name}
                  label={t('The account name to fund coins to')}
                  disabled
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
              {t('Create and Fund Account', { amount: AMOUNT_OF_COINS_FUNDED })}
            </Button>
          </div>
        </Stack>
      </form>
    </section>
  );
};
export default NewAccountFaucetPage;
