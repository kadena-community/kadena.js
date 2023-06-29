import { Button, SystemIcon } from '@kadena/react-ui';

import useTranslation from 'next-translate/useTranslation';
import React, { FC } from 'react';

export const WalletConnectButton: FC = () => {
  const { t } = useTranslation();
  return (
    <Button.Root title={t('Connect your wallet')} color="positive">
      {t('Connect your wallet')}
      <Button.Icon icon={SystemIcon.Link} />
    </Button.Root>
  );
};
