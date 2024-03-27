import { getClient } from '@/utils/client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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
    const client = getClient();

    const tx = JSON.parse(Buffer.from(transaction, 'base64').toString());
    setTx(tx);

    if (tx.sigs.filter((x: any) => x === null).length)
      return setStatus(SubmitStatus.INCOMPLETE);

    const res = await client.local(tx);
    setPreview(res);
  };

  useEffect(() => {
    if (!transaction) return;
    setStatus(SubmitStatus.SUBMITABLE);
    processTransaction(transaction);
  }, [transaction]);

  const doSubmit = async (txArg?: string) => {
    const innerTransaction = transaction;
    if (!innerTransaction) return;
    setStatus(SubmitStatus.LOADING);
    const client = getClient();

    const tx = JSON.parse(Buffer.from(innerTransaction, 'base64').toString());
    try {
      const txRes = await client.submit(tx);
      const result = await client.listen(txRes);
      //router.replace(getReturnUrl());

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
      // router.replace(getReturnUrl());
    } catch (err: any) {
      setStatus(SubmitStatus.ERROR);
      console.log(err);
      setResult({
        status: 'Could not submit transaction',
        data: err.toString(),
      });
    }
  };

  const isStatusLoading =
    status !== SubmitStatus.IDLE &&
    status !== SubmitStatus.INCOMPLETE &&
    status !== SubmitStatus.SUBMITABLE &&
    status !== SubmitStatus.SUCCESS &&
    status !== SubmitStatus.ERROR;
  return {
    doSubmit,
    tx,
    preview,
    result,
    status,
    SubmitStatus,
    isStatusLoading,
  };
};
