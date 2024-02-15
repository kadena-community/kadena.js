import { useAvatar } from '@/hooks/avatar';
import { wait } from '@/utils/wait';
import { useState } from 'react';
import { useProofOfUs } from '../proofOfUs';

import { useSignToken } from './signToken';

export const useMintMultiToken = () => {
  const { proofOfUs, background } = useProofOfUs();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [data, setData] = useState('');
  const { uploadBackground } = useAvatar();
  const { signToken } = useSignToken();

  const send = (status: IMintStatus) => {
    if (!proofOfUs) {
      setIsLoading(false);
      setHasError(true);
      return;
    }

    //TODO fix mintstatus
  };

  const handleUpload = async () => {
    if (!background || !proofOfUs) return;

    await uploadBackground(proofOfUs?.proofOfUsId);
  };

  const mintToken = async () => {
    setIsLoading(true);
    setHasError(false);
    await signToken();
    send('signing');

    send('uploading');
    handleUpload();
    await wait(2000);

    send('uploading_manifest');
    await wait(2000);

    send('minting');
    await wait(2000);

    send('success');
    setData('success');

    console.log('am I getting here!!');
    setIsLoading(false);
  };

  return { isLoading, hasError, data, mintToken };
};
