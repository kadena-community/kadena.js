import type { AccountQuery } from '@/__generated__/sdk';
import { useRouter } from '@/hooks/router';
import { Card, Stack, Text } from '@kadena/kode-ui';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { Media } from '../Layout/media';
import { ValueLoader } from '../LoadingSkeleton/ValueLoader/ValueLoader';
import { cardClass } from './style.css';

interface IProps extends PropsWithChildren {
  account: AccountQuery['fungibleAccount'];
  isLoading: boolean;
}

export const AccountCard: FC<IProps> = ({ account, isLoading }) => {
  const [route, setRoute] = useState('');
  const router = useRouter();

  useEffect(() => {
    setRoute(window.location.href);
  }, [router]);

  return (
    <Card fullWidth className={cardClass}>
      <Stack flexDirection={{ xs: 'row', md: 'column' }} gap="xs" width="100%">
        <Media greaterThanOrEqual="md">
          <Stack>
            <QRCode ecLevel="L" size={250} value={`${route}`} />
          </Stack>
        </Media>
        <Media lessThan="md">
          <QRCode ecLevel="L" size={200} value={`${route}`} />
        </Media>

        <Stack as="span" marginBlock="md" />

        <Text>Overall Balance</Text>
        <Stack gap="xs">
          <ValueLoader isLoading={isLoading}>
            <Text variant="code" bold>
              {account?.totalBalance}
            </Text>
            <Text variant="ui" bold>
              KDA
            </Text>
          </ValueLoader>
        </Stack>
      </Stack>
    </Card>
  );
};
