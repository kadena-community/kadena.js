import type { AccountQuery } from '@/__generated__/sdk';
import { useRouter } from '@/hooks/router';
import { Stack } from '@kadena/kode-ui';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect, useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { LayoutAsideContentBlock } from '../Layout/components/LayoutAsideContentBlock';
import { smallCardClass } from '../Layout/components/styles.css';
import { Media } from '../Layout/media';

interface IProps extends PropsWithChildren {
  account: AccountQuery['fungibleAccount'];
  isLoading: boolean;
}

export const AccountAside: FC<IProps> = ({ account, isLoading }) => {
  const [route, setRoute] = useState('');
  const router = useRouter();

  useEffect(() => {
    setRoute(window.location.href);
  }, [router]);

  return (
    <>
      <Media greaterThanOrEqual="md">
        <Stack justifyContent="center" width="100%">
          <QRCode ecLevel="L" size={250} value={`${route}`} />
        </Stack>
      </Media>
      <Media lessThan="md" className={smallCardClass}>
        <Stack justifyContent="center" width="100%">
          <QRCode ecLevel="L" size={200} value={`${route}`} />
        </Stack>
      </Media>

      <LayoutAsideContentBlock
        isLoading={isLoading}
        label="Overall Balance"
        body={`${account?.totalBalance} KDA`}
      />
    </>
  );
};
