import { useState } from 'react';

export const useClaimEventToken = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasSuccess, setHasSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);

  //TODO: add params and use actual data
  const claim = () => {
    setIsLoading(true);
    setHasError(false);
    setHasSuccess(false);

    setTimeout(() => {
      setIsLoading(false);
      setHasError(false);
      setHasSuccess(true);
    }, 5000);
  };

  return {
    isLoading,
    hasError,
    hasSuccess,
    claim,
  };
};
