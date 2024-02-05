import { useState } from 'react';
import { useProofOfUs } from './proofOfUs';
import { useSocket } from './socket';

export const useMintMultiToken = () => {
  const { proofOfUs } = useProofOfUs();
  const { socket } = useSocket();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [data, setData] = useState('');

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

  const mintToken = () => {
    setIsLoading(true);
    setHasError(false);

    setTimeout(() => {
      send('signing');

      //after upload => upload
      setTimeout(() => {
        send('uploading');
        //after manifest, actual uploadmanifest

        setTimeout(() => {
          send('uploading_manifest');
          //after manifest, actual minting

          setTimeout(() => {
            send('minting');
            //after manifest, actual minting

            const random = Math.random();
            if (random < 0.5) {
              setHasError(false);
              send('success');
              setData('success');
            } else {
              send('error');
              send('error');
              setHasError(true);
            }
          }, 1000);
        }, 1000);
      }, 1000);

      setIsLoading(false);
    }, 3000);
  };

  return { isLoading, hasError, data, mintToken };
};
