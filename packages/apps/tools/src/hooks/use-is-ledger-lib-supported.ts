import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { useState } from 'react';

const useIsLedgerLibSupported = () => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  if (typeof window !== 'undefined') {
    TransportWebHID.isSupported()
      .then((data) => {
        setIsSupported(data);
      })
      .catch(() => setIsSupported(false));
  }

  return isSupported;
};

export default useIsLedgerLibSupported;
