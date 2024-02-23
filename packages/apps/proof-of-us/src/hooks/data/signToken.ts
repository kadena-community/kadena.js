import { useProofOfUs } from '@/hooks/proofOfUs';
import { createManifest } from '@/utils/createManifest';
import { getReturnUrl } from '@/utils/getReturnUrl';
import { createConnectTokenTransaction } from '@/utils/proofOfUs';
import { createImageUrl, createMetaDataUrl } from '@/utils/upload';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAccount } from '../account';

export const useSignToken = () => {
  const { updateSigner, proofOfUs, background, addTx, hasSigned } =
    useProofOfUs();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [data] = useState<IProofOfUs | undefined>(undefined);
  const { account } = useAccount();
  const router = useRouter();

  const searchParams = useSearchParams();

  const createTx = async () => {
    if (!proofOfUs || !account) return;

    const imageData = await createImageUrl(background.bg);
    if (!imageData) {
      console.error('no image found');
      return;
    }
    const manifest = await createManifest(proofOfUs, imageData.url);

    const manifestData = await createMetaDataUrl(manifest);
    if (!manifestData) {
      console.error('no manifestData found');
      return;
    }

    const transaction = await createConnectTokenTransaction(
      manifestData?.url,
      proofOfUs,
      account,
    );

    return {
      transaction: transaction,
      manifestUri: manifestData?.url,
      imageUri: imageData.url,
    };
  };

  useEffect(() => {
    const transaction = searchParams.get('transaction');
    if (!transaction || hasSigned()) return;
    addTx(transaction);

    updateSigner({ signerStatus: 'success' }, true);

    setIsLoading(false);
    setHasError(false);
    router.replace(getReturnUrl());
  }, [searchParams]);

  const signToken = async () => {
    if (!proofOfUs || !account) return;
    setIsLoading(true);
    setHasError(false);

    updateSigner({ signerStatus: 'signing' }, true);

    let transaction = proofOfUs.tx;
    if (!transaction) {
      const transactionData = await createTx();
      if (!transactionData) return;

      transaction = Buffer.from(
        JSON.stringify(transactionData.transaction),
      ).toString('base64');

      updateSigner({
        manifestUri: transactionData.manifestUri,
        imageUri: transactionData.imageUri,
      });
    }

    router.push(
      `${
        process.env.NEXT_PUBLIC_WALLET_URL
      }/sign?transaction=${transaction}&returnUrl=${getReturnUrl()}
      `,
    );
  };

  return { isLoading, hasError, data, signToken };
};
