import { getClient } from '@/utils/client';
import { getReturnHostUrl, getReturnUrl } from '@/utils/getReturnUrl';
import { setSignatures } from '@/utils/setSignatures';
import { useRouter } from 'next/navigation';
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

export const useSubmit = () => {
  const { proofOfUs, signees, getSignees } = useProofOfUs();
  const [result, setResult] = useState<any>({});
  const [status, setStatus] = useState(SubmitStatus.IDLE);
  const [tx, setTx] = useState<any>(null);
  const [preview, setPreview] = useState<any>(null);
  const router = useRouter();

  const doSubmit = async (txArg?: string, proof?: IProofOfUsData) => {
    const innerProofOfUs = proof ? proof : proofOfUs;
    const innerTransaction = txArg ? txArg : JSON.parse(innerProofOfUs?.tx);

    console.log(innerTransaction, innerProofOfUs);
    if (!innerTransaction) return;
    setStatus(SubmitStatus.LOADING);
    const client = getClient();

    const latestSignees = await getSignees();

    const signedTransaction = txArg
      ? innerTransaction
      : setSignatures(innerTransaction, latestSignees);

    console.log({ signedTransaction });

    //const tx = JSON.parse(Buffer.from(signedTransaction, 'base64').toString());
    try {
      await client.submit(signedTransaction);

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
    tx,
    preview,
    result,
    status,
    SubmitStatus,
    isStatusLoading,
  };
};
