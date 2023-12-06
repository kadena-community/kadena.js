import { client } from '@/services/config';
import { base64URLStringToBuffer } from '@simplewebauthn/browser';
import { useEffect, useState } from 'react';

interface ISignResponse {
  signature: string;
  authenticatorData: string;
  clientDataJSON: string;
}
const getSig = (response: ISignResponse) => {
  const signature = Buffer.from(
    base64URLStringToBuffer(response.signature),
  ).toString('base64');
  const authenticatorData = Buffer.from(
    base64URLStringToBuffer(response.authenticatorData),
  ).toString('base64');
  const clientDataJSON = Buffer.from(
    base64URLStringToBuffer(response.clientDataJSON),
  ).toString('base64');
  if (process.env.STRING_SIG)
    return {
      sig: JSON.stringify({
        signature,
        authenticatorData,
        clientDataJSON,
      }),
    };
  return { sig: signature, authenticatorData, clientDataJSON };
};

export const useSubmit = (searchParams: ISearchParams) => {
  const { payload, response } = searchParams;

  const [result, setResult] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!payload || !response) return;
    const p = JSON.parse(Buffer.from(payload, 'base64').toString());
    const r = JSON.parse(Buffer.from(response, 'base64').toString());
    const tx = {
      ...p,
      // @TODO: this needs to map the signature to the correct index within the signatures array
      sigs: [getSig(r.response), ...p.sigs].filter(Boolean),
    };
    client
      .local(tx)
      .then(async (res) => {
        if (res.result.status !== 'success') {
          setResult(res);
          throw new Error('Transaction failed');
        }
        const txRes = await client.submit(tx);
        const result = await client.listen(txRes);
        setResult(result);
      })
      .catch((err) => {
        console.log(err);
        setResult({
          status: 'Could not submit transaction',
          data: err.toString(),
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [payload, response]);

  return {
    result,
    isLoading,
  };
};
