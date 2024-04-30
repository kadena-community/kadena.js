import { useProofOfUs } from '@/hooks/proofOfUs';
import { env } from '@/utils/env';
import { getReturnHostUrl, getReturnUrl } from '@/utils/getReturnUrl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAccount } from '../account';
import { useTransaction } from '../transaction';

export const useSignToken = () => {
  const {
    updateSignee,
    proofOfUs,
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
  const { transaction } = useTransaction();

  const sign = async () => {
    const signed = await hasSigned();

    if (!transaction || signed || !proofOfUs) return;
    const tx = JSON.parse(Buffer.from(transaction, 'base64').toString());

    const signature = await getSignature(tx);
    await updateSignee({ signerStatus: 'success', signature }, true);

    const accountIsInitiator = await isInitiator();
    await updateProofOfUs({
      // tx: transaction,
      status: accountIsInitiator ? 4 : 3,
    });

    setIsLoading(false);
    setHasError(false);

    //when the account is not the initiator you want to redirect.
    //if they are the initiator, you dont, so the app will submit the nft
    if (accountIsInitiator) return;

    router.replace(
      `${getReturnHostUrl()}/user/proof-of-us/mint/${tx.hash}?id=${
        proofOfUs.proofOfUsId
      }`,
    );
  };

  useEffect(() => {
    if (!proofOfUs) return;
    sign();
  }, [transaction, proofOfUs]);

  const signToken = async () => {
    if (!proofOfUs || !account) return;
    setIsLoading(true);
    setHasError(false);
    const transaction = proofOfUs.tx;
    await updateSignee({ signerStatus: 'signing' }, true);

    router.push(
      `${
        process.env.NEXT_PUBLIC_WALLET_URL
      }sign#transaction=${transaction}&chainId=${
        env.CHAINID
      }&returnUrl=${getReturnUrl()}
      `,
    );
  };

  return { isLoading, hasError, data, signToken };
};
