import { Button } from '@kadena/react-ui';

import { useWalletConnectClient } from '@/context/connect-wallet-context';
import useTranslation from 'next-translate/useTranslation';
import React, { FC } from 'react';

const WalletConnectButton: FC = () => {
  const { connect, isInitializing, disconnect, session } =
    useWalletConnectClient();
  const { t } = useTranslation();

  const handleClick = async (): Promise<void> => {
    if (session) {
      await disconnect();
      return;
    }

    await connect();
  };

  const buttonTitle = session
    ? t('Disconnect your wallet')
    : t('Connect your wallet');

  return (
    <Button
      title={buttonTitle}
      color="positive"
      icon="Link"
      iconAlign="right"
      onClick={handleClick}
      disabled={isInitializing}
      loading={isInitializing}
    >
      {buttonTitle}
    </Button>
  );
};

export default WalletConnectButton;
