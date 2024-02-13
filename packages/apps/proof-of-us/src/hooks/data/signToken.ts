import { useProofOfUs } from '@/hooks/proofOfUs';
import { wait } from '@/utils/wait';
import { useState } from 'react';

export const useSignToken = () => {
  const { updateSigner, proofOfUs } = useProofOfUs();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [data] = useState<IProofOfUs | undefined>(undefined);

  const signToken = async () => {
    if (!proofOfUs) return;
    setIsLoading(true);
    setHasError(false);

    updateSigner({ signerStatus: 'signing' }, true);

    //@TODO actual signing to wallet
    await wait(5000);

    updateSigner({ signerStatus: 'success' }, true);

    setIsLoading(false);
    setHasError(false);
  };

  return { isLoading, hasError, data, signToken };
};
