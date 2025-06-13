import {
  AccountNameField,
  ChainSelect,
  FormStatusNotification,
  NAME_VALIDATION,
} from '@/components/Global';
import { menuData } from '@/constants/side-menu-items';
import { useToolbar } from '@/context/layout-context';
import { useEvmFaucet } from '@/hooks/EvmFaucet';
import { zodResolver } from '@hookform/resolvers/zod';
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
  Text,
} from '@kadena/kode-ui';
import type { ChainId } from '@kadena/types';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { buttonContainerClass, containerClass } from '../styles.css';

const schema = z.object({
  name: NAME_VALIDATION,
});

type FormData = z.infer<typeof schema>;

const ExistingAccountFaucetPage: FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const buttonRef = useRef<HTMLButtonElement>(null);

  useToolbar(menuData, router.pathname);
  const {
    dispenseTokens,
    dispenseAmount,
    requestStatus,
    setChainId,
    chainId,
    faucetBalance,
  } = useEvmFaucet();

  const onFormSubmit = async (data: FormData) => {
    await dispenseTokens(data.name);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <section className={containerClass}>
      <Head>
        <title>Kadena Developer Tools - EVM Faucet</title>
      </Head>
      <Breadcrumbs>
        <BreadcrumbsItem>{t('Faucet')}</BreadcrumbsItem>
        <BreadcrumbsItem>{t('Fund EVM Address')}</BreadcrumbsItem>
      </Breadcrumbs>

      <Stack
        as="form"
        onSubmit={handleSubmit(onFormSubmit)}
        gap="lg"
        width="100%"
        flexDirection="column"
      >
        <Heading as="h4">{t('Add Funds to EVM Address')}</Heading>

        <Notification intent="warning" role="status" type="inlineStacked">
          <NotificationHeading>
            {t('This EVM Faucet is running on DEVNET')}
          </NotificationHeading>
          <Text variant="code">
            faucetBalance: {faucetBalance} <Text color="emphasize">KDA</Text>
          </Text>
        </Notification>

        <FormStatusNotification
          status={requestStatus.status}
          statusBodies={{
            successful: t('The coins have been funded to the given address.'),
          }}
          body={requestStatus.message}
        />
        <Stack flexDirection="column" gap="lg" width="100%">
          <Card fullWidth>
            <Stack width="100%" gap="lg">
              <AccountNameField
                {...register('name')}
                errorMessage={errors.name?.message}
                label={t('The EVM address to fund coins to')}
              />

              <ChainSelect
                onSelectionChange={setChainId as any}
                selectedKey={chainId as ChainId}
                aria-label="Select Chain ID"
                chainCount={5}
                chainCountStart={20}
              />
            </Stack>
          </Card>
          <div className={buttonContainerClass}>
            <Button
              ref={buttonRef}
              isLoading={requestStatus.status === 'processing'}
              isDisabled={requestStatus.status === 'processing'}
              endVisual={<MonoKeyboardArrowRight />}
              title={t('Fund X Coins', { amount: dispenseAmount })}
              type="submit"
            >
              {t('Fund X Coins', { amount: dispenseAmount })}
            </Button>
          </div>
        </Stack>
      </Stack>
    </section>
  );
};

export default ExistingAccountFaucetPage;
