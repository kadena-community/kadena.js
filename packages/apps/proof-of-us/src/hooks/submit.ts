import { getClient } from '@/utils/client';
import { getReturnHostUrl, getReturnUrl } from '@/utils/getReturnUrl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useProofOfUs } from './proofOfUs';

export enum SubmitStatus {
  IDLE = 'idle',
  SUCCESS = 'success',
  ERROR = 'error',
  LOADING = 'loading',
  SUBMITABLE = 'submitable',
  INCOMPLETE = 'incomplete',
}

const setSignatures = (tx: string, signees: IProofOfUsSignee[]): string => {
  const innerTx = JSON.parse(Buffer.from(tx, 'base64').toString());
  const { signers } = JSON.parse(innerTx.cmd);
  const sigs = signers.reduce((acc: any, val: any) => {
    const pubKey = val.pubKey;
    const signee = signees.find((signee) => signee.publicKey === pubKey);
    if (!signee) return acc;

    acc.push({ sig: signee.signature });

    return acc;
  }, []);

  return Buffer.from(JSON.stringify({ ...innerTx, sigs })).toString('base64');
};

export const useSubmit = () => {
  const searchParams = useSearchParams();
  const { proofOfUs, signees } = useProofOfUs();
  const transaction = searchParams.get('transaction');
  const [result, setResult] = useState<any>({});
  const [status, setStatus] = useState(SubmitStatus.IDLE);
  const [tx, setTx] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);
  const router = useRouter();

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

  const doSubmit = async (txArg?: string, waitForMint: boolean = false) => {
    const innerTransaction = txArg ? txArg : transaction;

    if (!innerTransaction) return;
    setStatus(SubmitStatus.LOADING);
    const client = getClient();

    const signedTransaction = txArg
      ? innerTransaction
      : setSignatures(innerTransaction, signees);

    const tx = JSON.parse(Buffer.from(signedTransaction, 'base64').toString());
    try {
      const txRes = await client.submit(tx);

      if (waitForMint) {
        const result = await client.listen(txRes);

        if (result.result.status === 'success') {
          setStatus(SubmitStatus.SUCCESS);
          setResult(result);
        } else {
          setStatus(SubmitStatus.SUCCESS);
          setResult({
            status: 'Could not submit transaction',
            data: 'Already claimed',
          });
        }
        router.replace(`${getReturnUrl()}`);
      } else {
        if (!proofOfUs?.tokenId || !proofOfUs?.requestKey) {
          router.replace(`${getReturnHostUrl()}/user`);
          return;
        }

        router.replace(
          `${getReturnHostUrl()}/user/proof-of-us/t/${proofOfUs?.tokenId}/${proofOfUs?.requestKey}`,
        );
        return;
      }
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
    tx,
    preview,
    result,
    status,
    SubmitStatus,
    isStatusLoading,
  };
};
