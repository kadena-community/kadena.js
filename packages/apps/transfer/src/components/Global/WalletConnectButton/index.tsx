import { Button } from '@kadena/react-ui';

import useTranslation from 'next-translate/useTranslation';
import React, { FC } from 'react';

export const WalletConnectButton: FC = () => {
  const { t } = useTranslation();
  return (
    <Button
      title={t('Connect your wallet')}
      color="positive"
      icon="Link"
      iconAlign="right"
    >
      {t('Connect your wallet')}
    </Button>
  );
};
