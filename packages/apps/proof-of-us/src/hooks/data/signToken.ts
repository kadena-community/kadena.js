import { useProofOfUs } from '@/hooks/proofOfUs';
import { getReturnHostUrl } from '@/utils/getReturnUrl';
import { sign as signSpireKey } from '@kadena/spirekey-sdk';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAccount } from '../account';
import { useSubmit } from '../submit';

export const useSignToken = () => {
  const {
    updateSignee,
    proofOfUs,
    signees,
    updateProofOfUs,
    getSignature,
    isInitiator,
  } = useProofOfUs();
  // const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [data] = useState<IProofOfUs | undefined>(undefined);
  const { account } = useAccount();
  const router = useRouter();
  const { doSubmit, setIsLoading, isStatusLoading } = useSubmit();

  const signToken = async () => {
    if (!proofOfUs || !account || !signees) return;
    await updateSignee({ signerStatus: 'signing' }, true);
    setIsLoading(true);
    setHasError(false);

    console.log(proofOfUs.tx);
    try {
      setIsLoading(true);

      console.log(22);
      const { transactions, isReady } = await signSpireKey(
        [JSON.parse(proofOfUs.tx)],
        [account],
      );

      console.log('before');
      await isReady();

      console.log(transactions);
      const signature = await getSignature(transactions[0]);

      await updateSignee({ signerStatus: 'success', signature }, true);

      const accountIsInitiator = await isInitiator();
      await updateProofOfUs({
        tx: JSON.stringify(transactions[0]),
        status: 3,
      });

      if (accountIsInitiator) {
        await doSubmit();
      } else {
        router.replace(
          `${getReturnHostUrl()}/user/proof-of-us/mint/${transactions[0].hash}?id=${
            proofOfUs.proofOfUsId
          }`,
        );
      }
    } catch (e) {
      setIsLoading(false);
    }
  };

  return { isLoading: isStatusLoading, hasError, data, signToken };
};
