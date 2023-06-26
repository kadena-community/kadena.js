import {SystemIcons} from "@kadena/react-components";
import {Button} from "@kadena/react-ui";

import useTranslation from "next-translate/useTranslation";
import React, {FC} from "react";

export const WalletConnectButton: FC = () => {
  const {t} = useTranslation()
  return (
      <Button title={t('Connect your wallet')} color="positive" >
        {t('Connect your wallet')}
        <SystemIcons.Link />
      </Button>
  )
}
