import { useProofOfUs } from '@/hooks/proofOfUs';
import { env } from '@/utils/env';
import { getReturnHostUrl, getReturnUrl } from '@/utils/getReturnUrl';
import { SignedTransactions, sign as signSpireKey } from '@kadena/spirekey-sdk';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAccount } from '../account';
import { useSubmit } from '../submit';
import { useTransaction } from '../transaction';

export const useSignToken = () => {
  const {
    updateSignee,
    proofOfUs,
    signees,
    hasSigned,
    updateProofOfUs,
    getSignature,
    isInitiator,
  } = useProofOfUs();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [data] = useState<IProofOfUs | undefined>(undefined);
  const { account } = useAccount();
  const router = useRouter();
  const { doSubmit } = useSubmit();
  // const { transaction } = useTransaction();

  // const sign = async () => {
  //   const signed = await hasSigned();

  //   if (signed || !proofOfUs) return;
  //   //const tx = JSON.parse(Buffer.from(transaction, 'base64').toString());

  //   const signature = await getSignature();

  //   const { transactions, isReady } = await signSpireKey(
  //     [proofOfUs.tx],
  //     [account],
  //   );
  //   await isReady();

  //   await updateSignee({ signerStatus: 'success', signature }, true);

  //   const accountIsInitiator = await isInitiator();
  //   await updateProofOfUs({
  //     tx: transactions[0],
  //     status: accountIsInitiator ? 4 : 3,
  //   });

  //   setIsLoading(false);
  //   setHasError(false);

  //   //when the account is not the initiator you want to redirect.
  //   //if they are the initiator, you dont, so the app will submit the nft
  //   // if (accountIsInitiator) return;

  //   // router.replace(
  //   //   `${getReturnHostUrl()}/user/proof-of-us/mint/${tx.hash}?id=${
  //   //     proofOfUs.proofOfUsId
  //   //   }`,
  //   // );
  // };

  // useEffect(() => {
  //   if (!proofOfUs) return;
  //   sign();
  // }, [transaction, proofOfUs]);

  const signToken = async () => {
    if (!proofOfUs || !account || !signees) return;
    await updateSignee({ signerStatus: 'signing' }, true);
    setIsLoading(true);
    setHasError(false);

    const { transactions, isReady } = await signSpireKey(
      [JSON.parse(proofOfUs.tx)],
      signees,
    );

    console.log({ transactions, isReady });

    await isReady();

    const signature = await getSignature(transactions[0]);

    await updateSignee({ signerStatus: 'success', signature }, true);

    const accountIsInitiator = await isInitiator();
    await updateProofOfUs({
      tx: JSON.stringify(transactions[0]),
      status: accountIsInitiator ? 4 : 3,
    });

    if (accountIsInitiator) {
      console.log('accountIsInitiator');
      await doSubmit();
    } else {
      router.replace(
        `${getReturnHostUrl()}/user/proof-of-us/mint/${transactions[0].hash}?id=${
          proofOfUs.proofOfUsId
        }`,
      );
    }
  };

  return { isLoading, hasError, data, signToken };
};
