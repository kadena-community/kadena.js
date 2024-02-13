import { createClient } from '@kadena/client';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ISearchProps extends ReadonlyURLSearchParams {
  transaction: string;
}

export enum SubmitStatus {
  IDLE = 'idle',
  SUCCESS = 'success',
  ERROR = 'error',
  LOADING = 'loading',
  SUBMITABLE = 'submitable',
  INCOMPLETE = 'incomplete',
}

export const useSubmit = () => {
  const searchParams = useSearchParams();
  const transaction = searchParams.get('transaction');
  const [result, setResult] = useState<any>({});
  const [status, setStatus] = useState(SubmitStatus.IDLE);
  const [tx, setTx] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);

  const processTransaction = async (transaction: string) => {
    const client = createClient();

    const tx = JSON.parse(Buffer.from(transaction, 'base64').toString());
    setTx(tx);
    if (tx.sigs.filter((x: any) => x === null).length)
      return setStatus(SubmitStatus.INCOMPLETE);

    const res = await client.local(tx);
    console.log(222, res);
    setPreview(res);
    setStatus(SubmitStatus.SUBMITABLE);
  };

  useEffect(() => {
    if (!transaction) return;
    processTransaction(transaction);
  }, [transaction]);

  const doSubmit = async () => {
    if (!transaction) return;

    const client = createClient();

    setStatus(SubmitStatus.LOADING);

    const tx = JSON.parse(Buffer.from(transaction, 'base64').toString());
    try {
      const txRes = await client.submit(tx);
      const result = await client.listen(txRes);

      setStatus(SubmitStatus.SUCCESS);
      setResult(result);
    } catch (err: any) {
      console.log(err);
      setStatus(SubmitStatus.ERROR);
      setResult({
        status: 'Could not submit transaction',
        data: err.toString(),
      });
    }
  };

  return {
    doSubmit,
    tx,
    preview,
    result,
    status,
    SubmitStatus,
  };
};
