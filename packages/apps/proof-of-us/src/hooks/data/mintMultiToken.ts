import { useAvatar } from '@/hooks/avatar';
import { useState } from 'react';
import { useProofOfUs } from '../proofOfUs';

import { createClient } from '@kadena/client';
import { useSignToken } from './signToken';

export const useMintMultiToken = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { proofOfUs, background } = useProofOfUs();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasError, setHasError] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { uploadBackground } = useAvatar();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { signToken } = useSignToken();

  // const send = (status: IMintStatus) => {
  //   if (!proofOfUs) {
  //     setIsLoading(false);
  //     setHasError(true);
  //     return;
  //   }

  //   //TODO fix mintstatus
  // };

  // const handleUpload = async () => {
  //   if (!background || !proofOfUs) return;

  //   await uploadBackground(proofOfUs?.proofOfUsId);
  // };

  const mintToken = async () => {
    if (!proofOfUs?.tx) return;

    const client = createClient();
    const tx = JSON.parse(Buffer.from(proofOfUs.tx, 'base64').toString());

    const fixedTx = { cmd: JSON.parse(tx.cmd) };
    console.log(222, fixedTx);
    console.log(34, tx);
    const res = await client.local(tx);
    console.log(111, res);

    //console.log(1, res);

    // setIsLoading(true);
    // setHasError(false);
    // await signToken();
    // send('signing');
    // send('uploading');
    // handleUpload();
    // await wait(2000);
    // send('uploading_manifest');
    // await wait(2000);
    // send('minting');
    // await wait(2000);
    // send('success');
    // setData('success');
    // console.log('am I getting here!!');
    // setIsLoading(false);
  };

  return { isLoading, hasError, data, mintToken };
};
