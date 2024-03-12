import { claimAttendanceToken } from '@/utils/proofOfUs';
import { useState } from 'react';
import { useAccount } from '../account';

export const useClaimAttendanceToken = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasSuccess, setHasSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [isPending] = useState(false);
  const { account } = useAccount();

  //TODO: add params and use actual data
  const claim = (eventId: string) => {
    if (!account) {
      setHasError(true);
      return;
    }
    setIsLoading(true);
    setHasError(false);
    setHasSuccess(false);

    const transaction = claimAttendanceToken(eventId, account);

    return transaction;
  };

  return {
    isPending,
    isLoading,
    hasError,
    hasSuccess,
    claim,
  };
};
