import { hasMintedAttendaceToken } from '@/utils/proofOfUs';
import { useEffect, useState } from 'react';
import { useTokens } from '../tokens';

export const useHasMintedAttendaceToken = () => {
  const { getToken } = useTokens();
  const [isLoading, setIsLoading] = useState(false);
  const [hasSuccess, setHasSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isPending] = useState(false);

  const hasMinted = async (
    eventId: string,
    accountName?: string,
  ): Promise<boolean> => {
    console.log(11, accountName);
    if (!accountName) {
      setHasError(true);
      return false;
    }

    const token = getToken(eventId);

    setIsLoading(true);
    setHasError(false);
    setHasSuccess(false);

    const result = await hasMintedAttendaceToken(eventId, accountName);
    console.log(result);
    const listener = await token?.listener;
    console.log({ result, listener });
    return result && !!listener;
  };

  return {
    isPending,
    isLoading,
    hasError,
    hasSuccess,
    hasMinted,
  };
};
