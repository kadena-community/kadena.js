import { useState } from 'react';
import { useProofOfUs } from './proofOfUs';

export const useSignToken = () => {
  const { addSignee } = useProofOfUs();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [data] = useState<IProofOfUs | undefined>(undefined);

  const signToken = () => {
    setIsLoading(true);
    setHasError(false);

    setTimeout(() => {
      addSignee();

      setIsLoading(true);
      setHasError(false);
    }, 5000);
  };

  return { isLoading, hasError, data, signToken };
};
