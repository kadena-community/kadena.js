import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { useEffect, useState } from 'react';

const useIsLedgerLibSupported = () => {
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    async function checkIsSupported() {
      try {
        const isSupported = await TransportWebHID.isSupported();
        setIsSupported(isSupported);
      } catch (e) {
        setIsSupported(false);
      }
    }
    void checkIsSupported();
  }, []);

  return isSupported;
};

export default useIsLedgerLibSupported;
