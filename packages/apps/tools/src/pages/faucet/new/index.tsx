import type { ICommandResult } from '@kadena/chainweb-node-client';
import type { InputWrapperStatus } from '@kadena/react-ui';
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Grid,
  Heading,
  IconButton,
  Notification,
  Stack,
  Text,
} from '@kadena/react-ui';

import {
  buttonContainerClass,
  containerClass,
  iconButtonWrapper,
  inputWrapperStyle,
  keyIconWrapperStyle,
  notificationContainerStyle,
  notificationLinkStyle,
  pubKeyInputWrapperStyle,
} from './styles.css';

import type { FormStatus } from '@/components/Global';
import { ChainSelect, FormStatusNotification } from '@/components/Global';
import AccountNameField from '@/components/Global/AccountNameField';
import type { PredKey } from '@/components/Global/PredKeysSelect';
import { PredKeysSelect } from '@/components/Global/PredKeysSelect';
import { PublicKeyField } from '@/components/Global/PublicKeyField';
import Routes from '@/constants/routes';
import { useWalletConnectClient } from '@/context/connect-wallet-context';
import { useToolbar } from '@/context/layout-context';
import { usePersistentChainID } from '@/hooks';
import { fundCreateNewAccount } from '@/services/faucet/fund-create-new';
import { zodResolver } from '@hookform/resolvers/zod';
import { blake2sHex } from 'blakejs';
import useTranslation from 'next-translate/useTranslation';
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

const NewAccountFaucetPage: FC = () => {
  const { t } = useTranslation('common');
  const { selectedNetwork } = useWalletConnectClient();

  const [chainID, onChainSelectChange] = usePersistentChainID();
  const [pred, onPredSelectChange] = useState<PredKey>('keys-all');
  const [requestStatus, setRequestStatus] = useState<{
    status: FormStatus;
    message?: string;
  }>({ status: 'idle' });
  const [pubKeys, setPubKeys] = useState<string[]>([]);
  const [currentKey, setCurrentKey] = useState<string>('');

  const [validRequestKey, setValidRequestKey] = useState<
    InputWrapperStatus | undefined
  >();

  const generateAccountName =
    pubKeys.length === 0
      ? ''
      : pubKeys.length === 1
      ? `k:${pubKeys[0]}`
      : `w:${blake2sHex(pubKeys.join())}`;

  const schema = z.object({
    name: z.string(),
    pubKey: z.string().length(64, t('Insert valid public key')),
  });
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    setError,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: { name: generateAccountName, pubKey: currentKey },
  });

  const [inputError, setInputError] = useState<string>('');

  useToolbar([
    {
      title: t('New'),
      icon: 'History',
      href: Routes.FAUCET_NEW,
    },
  ]);

  useEffect(() => {
    setInputError('');
    setValidRequestKey(undefined);
  }, [currentKey]);

  const onFormSubmit = useCallback(
    async (data: FormData) => {
      if (!pubKeys.length) {
        setValidRequestKey('negative');
        setInputError(t('Please provide one or more public keys'));
        return;
      }

      if (errors?.pubKey?.message) {
        setInputError(errors?.pubKey?.message);
      }

      setInputError('');
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
    [chainID, t],
  );

  const testnetNotSelected: boolean = selectedNetwork !== 'testnet04';
  const disabledButton: boolean =
    requestStatus.status === 'processing' || testnetNotSelected;

  const addPublicKey = async (
    e: React.MouseEvent<HTMLButtonElement>,
    value: string,
  ): Promise<void> => {
    e.preventDefault();

    const isValidInput = await trigger('pubKey');

    if (!isValidInput) {
      setError('pubKey', {
        type: 'invalid',
        message: t('Insert valid public key'),
      });
      setValidRequestKey('negative');
      return;
    }
    setValidRequestKey(undefined);
    setInputError('');
    clearErrors();

    const copyPubKeys = [...pubKeys];
    const isDuplicate = copyPubKeys.includes(value);

    if (isDuplicate) {
      setInputError(t('Duplicate public key'));
      setValidRequestKey('negative');
      return;
    }

    copyPubKeys.push(value);
    setCurrentKey('');
    setPubKeys(copyPubKeys);
  };

  const deletePublicKey = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ): void => {
    e.preventDefault();

    const copyPubKeys = [...pubKeys];
    copyPubKeys.splice(index, 1);

    setPubKeys(copyPubKeys);
  };

  const renderPubKeys = () => (
    <Stack direction={'column'}>
      {pubKeys.map((key, index) => (
        <div key={index} className={keyIconWrapperStyle}>
          <Text size={'md'}>{key}</Text>
          <IconButton
            icon={'TrashCan'}
            onClick={(event) => deletePublicKey(event, index)}
          />
        </div>
      ))}
    </Stack>
  );

  return (
    <section className={containerClass}>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item>{t('Faucet')}</Breadcrumbs.Item>
        <Breadcrumbs.Item>{t('New')}</Breadcrumbs.Item>
      </Breadcrumbs.Root>{' '}
      <Heading as="h4">{t('Create and Fund New Account')}</Heading>
      <div className={notificationContainerStyle}>
        {testnetNotSelected ? (
          <Notification.Root
            color="warning"
            expanded={true}
            icon="Information"
            title={t(
              `The Faucet is not available on Mainnet. On other networks, the Faucet smart contract must be deployed to fund accounts. In the Module Explorer you can see if it's deployed: https://tools.kadena.io/transactions/module-explorer?module=user.coin-faucet&chain=1`,
            )}
          />
        ) : null}
      </div>
      <div className={notificationContainerStyle}>
        <Notification.Root
          color="warning"
          expanded={true}
          icon="Information"
          title={t(`Before you start`)}
        >
          Generate a key pair by visiting this{' '}
          <a
            className={notificationLinkStyle}
            target={'_blank'}
            href={'https://transfer.chainweb.com/'}
            rel="noreferrer"
          >
            webpage
          </a>{' '}
          or by downloading a{' '}
          <a
            className={notificationLinkStyle}
            target={'_blank'}
            href={'https://kadena.io/chainweaver-tos/'}
            rel="noreferrer"
          >
            wallet.
          </a>
        </Notification.Root>
      </div>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <FormStatusNotification
          status={requestStatus.status}
          statusBodies={{
            successful: `${AMOUNT_OF_COINS_FUNDED} ${t(
              'coins have been funded to ',
            )}${generateAccountName}`,
          }}
          body={requestStatus.message}
        />
        <Card fullWidth>
          <Heading as="h5">Public Keys</Heading>
          <Box marginBottom="$4" />

          <div className={pubKeyInputWrapperStyle}>
            <div className={inputWrapperStyle}>
              <PublicKeyField
                helperText={inputError || errors?.pubKey?.message}
                status={validRequestKey}
                inputProps={{
                  ...register('pubKey'),
                  onChange: (e) => setCurrentKey(e.target.value),
                }}
                error={errors.pubKey}
              />
            </div>
            <div className={iconButtonWrapper}>
              <IconButton
                icon={'Plus'}
                onClick={(e) => addPublicKey(e, currentKey)}
                color="primary"
              />
            </div>
          </div>

          {pubKeys.length > 0 ? renderPubKeys() : null}

          {pubKeys.length > 1 ? (
            <PredKeysSelect
              onChange={onPredSelectChange}
              value={pred}
              ariaLabel="Select Chain ID"
            />
          ) : null}
        </Card>
        <Card fullWidth>
          <Heading as="h5">{t('Account')}</Heading>
          <Box marginBottom="$4" />
          <AccountNameField
            inputProps={register('name')}
            label={t('The account name to fund coins to')}
            disabled
            noIcon
          />
          <Grid.Root columns={2} marginTop="$4">
            <Grid.Item>
              <ChainSelect
                onChange={onChainSelectChange}
                value={chainID}
                ariaLabel="Select Keys Pred"
              />
            </Grid.Item>
          </Grid.Root>
        </Card>
        <div className={buttonContainerClass}>
          <Button
            loading={requestStatus.status === 'processing'}
            icon="TrailingIcon"
            iconAlign="right"
            title={t('Fund X Coins', { amount: AMOUNT_OF_COINS_FUNDED })}
            disabled={disabledButton}
          >
            {t('Create and Fund Account', { amount: AMOUNT_OF_COINS_FUNDED })}
          </Button>
        </div>
      </form>
      <Stack marginY={'$md'}>
        <Text>
          If you want to fund an existing account, visit{' '}
          <a className={notificationLinkStyle} href={'/faucet/existing'}>
            this page
          </a>
          .
        </Text>
      </Stack>
    </section>
  );
};
export default NewAccountFaucetPage;
