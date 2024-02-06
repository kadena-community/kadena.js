import { AccountNameField } from '@/components/Global';
import { useAccountDetailsQuery } from '@/hooks/use-account-details-query';
import {
  Breadcrumbs,
  BreadcrumbsItem,
  Card,
  ContentHeader,
  Heading,
  Stack,
  Text,
} from '@kadena/react-ui';
import useTranslation from 'next-translate/useTranslation';
import Head from 'next/head';
import React, { useState } from 'react';

const Storybook = () => {
  const { t } = useTranslation('common');

  const [accountName, setAccountName] = useState<string>('');
  const {
    error,
    data: accountDetails,
    isFetching,
  } = useAccountDetailsQuery({
    account: accountName,
    networkId: 'testnet04',
    chainId: '1',
    refetchOnWindowFocus: false,
  });

  console.log({ error, accountDetails });

  return (
    <section>
      <Head>
        <title>Kadena Developer Tools - Storybook</title>
      </Head>
      <Breadcrumbs>
        <BreadcrumbsItem>{t('Storybook')}</BreadcrumbsItem>
      </Breadcrumbs>
      <Heading as="h4">{t('Storybook')}</Heading>
      <Stack>
        <Card>
          <Stack flexDirection="column">
            <Heading as="h5">
              <Text as="code">useAccountDetailsQuery</Text>
            </Heading>
            <AccountNameField
              label="Account Name"
              onValueChange={(value) => {
                setAccountName(value);
              }}
            />
            <>
              <ContentHeader icon="Account" heading="User Details" />
              {accountDetails ? (
                <dl>
                  {Object.entries(accountDetails).map(([key, value]) => {
                    return (
                      <>
                        <dt>{key}</dt>
                        <dd>{value.toString()}</dd>
                      </>
                    );
                  })}
                </dl>
              ) : (
                <Text>User not found (yet)</Text>
              )}
            </>
            {isFetching && <Text>Loading...</Text>}
            {error ? (
              <Text>
                Error:{' '}
                {error instanceof Error || Object.hasOwn(error, 'message')
                  ? (error as { message: string }).message
                  : 'Something went wrong'}
              </Text>
            ) : null}
          </Stack>
        </Card>
      </Stack>
    </section>
  );
};

export default Storybook;
