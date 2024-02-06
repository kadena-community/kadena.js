import { useAvatar } from '@/hooks/avatar';
import { wait } from '@/utils/wait';
import { useState } from 'react';
import { useProofOfUs } from '../proofOfUs';
import { useSocket } from '../socket';
import { useSignToken } from './signToken';

export const useMintMultiToken = () => {
  const { proofOfUs, background } = useProofOfUs();
  const { socket } = useSocket();
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

    socket?.emit('updateStatus', {
      content: {
        mintStatus: status,
      },
      to: proofOfUs.proofOfUsId,
    });
  };

  const handleUpload = async () => {
    if (!background || !proofOfUs) return;

    await uploadBackground(proofOfUs?.proofOfUsId);
  };

  const mintToken = async () => {
    setIsLoading(true);
    setHasError(false);
    console.log(666666);
    await signToken();
    send('signing');

    console.log(444444);

    send('uploading');
    console.log(555555);
    handleUpload();
    await wait(2000);

    console.log(333333);

    send('uploading_manifest');
    await wait(2000);

    console.log(22222);
    send('minting');
    await wait(2000);

    console.log(11111);
    send('success');
    setData('success');

    console.log('am I getting here!!');
    setIsLoading(false);
  };

  return { isLoading, hasError, data, mintToken };
};
