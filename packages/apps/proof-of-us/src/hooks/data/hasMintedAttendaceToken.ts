import { hasMintedAttendaceToken } from '@/utils/proofOfUs';
import { useState } from 'react';

export const useHasMintedAttendaceToken = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasSuccess, setHasSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isPending] = useState(false);

  const hasMinted = async (
    eventId: string,
    accountName?: string,
  ): Promise<boolean> => {
    if (!accountName) {
      setHasError(true);
      return false;
    }
    setIsLoading(true);
    setHasError(false);
    setHasSuccess(false);

    const result = await hasMintedAttendaceToken(eventId, accountName);

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
