import { getClient } from '@/utils/client';
import { getReturnHostUrl, getReturnUrl } from '@/utils/getReturnUrl';
import { setSignatures } from '@/utils/setSignatures';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useProofOfUs } from './proofOfUs';
import { useTransaction } from './transaction';

export enum SubmitStatus {
  IDLE = 'idle',
  SUCCESS = 'success',
  ERROR = 'error',
  LOADING = 'loading',
  SUBMITABLE = 'submitable',
  INCOMPLETE = 'incomplete',
}

export const useSubmit = () => {
  const { proofOfUs, signees } = useProofOfUs();
  const [result, setResult] = useState<any>({});
  const [status, setStatus] = useState(SubmitStatus.IDLE);
  const [tx, setTx] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);
  const router = useRouter();

  const { transaction } = useTransaction();

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

  const doSubmit = async (txArg?: string, proof?: IProofOfUsData) => {
    const innerTransaction = txArg ? txArg : transaction;
    const innerProofOfUs = proof ? proof : proofOfUs;
    console.log(innerTransaction);
    if (!innerTransaction) return;
    setStatus(SubmitStatus.LOADING);
    const client = getClient();

    const signedTransaction = txArg
      ? innerTransaction
      : setSignatures(innerTransaction, signees);

    const tx = JSON.parse(Buffer.from(signedTransaction, 'base64').toString());
    try {
      await client.submit(tx);

      if (!innerProofOfUs?.requestKey) {
        router.replace(`${getReturnHostUrl()}/user`);
        return;
      }

      router.replace(
        `${getReturnHostUrl()}/user/proof-of-us/mint/${innerProofOfUs?.requestKey}?id=${
          innerProofOfUs.proofOfUsId
        }`,
      );

      return;
    } catch (err: any) {
      setStatus(SubmitStatus.ERROR);
      console.log(err);
      setResult({
        status: 'Could not submit transaction',
        data: err.toString(),
      });
      router.replace(getReturnUrl());
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
    transaction,
    tx,
    preview,
    result,
    status,
    SubmitStatus,
    isStatusLoading,
  };
};
