import { hasMintedAttendaceToken } from '@/utils/proofOfUs';
import { useState } from 'react';
import { useAccount } from '../account';

export const useHasMintedAttendaceToken = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasSuccess, setHasSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isPending] = useState(false);
  const { account } = useAccount();

  const hasMinted = async (eventId: string): Promise<boolean> => {
    if (!account) {
      setHasError(true);
      return false;
    }
    setIsLoading(true);
    setHasError(false);
    setHasSuccess(false);

    const result = await hasMintedAttendaceToken(eventId, account);

    setIsLoading(false);

    return result;
  };

  return {
    isPending,
    isLoading,
    hasError,
    hasSuccess,
    hasMinted,
  };
};
