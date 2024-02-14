import { createClient } from '@kadena/client';
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
    const client = createClient();

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

  const doSubmit = async () => {
    if (!transaction) return;

    console.log(1);

    const client = createClient();

    setStatus(SubmitStatus.LOADING);

    const tx = JSON.parse(Buffer.from(transaction, 'base64').toString());
    try {
      console.log(2);
      const txRes = await client.submit(tx);
      const result = await client.listen(txRes);

      console.log({ txRes });
      console.log({ result });

      console.log(3);

      if (result.result.status === 'success') {
        console.log(4);
        setStatus(SubmitStatus.SUCCESS);
        setResult(result);
      } else {
        console.log(5);
        setStatus(SubmitStatus.ERROR);
        setResult({
          status: 'Could not submit transaction',
          data: 'Already claimed',
        });
      }
    } catch (err: any) {
      setStatus(SubmitStatus.ERROR);
      console.log(6);
      console.log(err);
      setResult({
        status: 'Could not submit transaction',
        data: err.toString(),
      });
    }
  };

  console.log({ status });
  return {
    doSubmit,
    tx,
    preview,
    result,
    status,
    SubmitStatus,
  };
};
