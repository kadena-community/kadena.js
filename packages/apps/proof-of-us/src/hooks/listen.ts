import { getClient } from '@/utils/client';
import { env } from '@/utils/env';
import { useState } from 'react';
import { SubmitStatus } from './submit';

export const useListen = () => {
  const [status, setStatus] = useState(SubmitStatus.LOADING);
  const [result, setResult] = useState<any>({});

  const listen = async (requestKey: string) => {
    const client = getClient();
    const txRes = {
      chainId: env.CHAINID,
      networkId: env.NETWORKID,
      requestKey,
    };

    try {
      const result = (await client.pollStatus(txRes))[txRes.requestKey];

      if (result.result.status === 'success') {
        setStatus(SubmitStatus.SUCCESS);
        setResult(result);
      } else {
        setStatus(SubmitStatus.ERROR);
        setResult({
          status: 'Could not submit transaction',
          data: 'Already claimed',
        });
      }
    } catch (err: any) {
      setStatus(SubmitStatus.ERROR);
      console.log(err);
      setResult({
        status: 'Could not submit transaction',
        data: err.toString(),
      });
    }
  };

  return { status, result, listen };
};
