import { useProofOfUs } from '@/hooks/proofOfUs';
import { createManifest } from '@/utils/createManifest';
import { getReturnUrl } from '@/utils/getReturnUrl';
import { createConnectTokenTransaction, getTokenId } from '@/utils/proofOfUs';
import { createImageUrl, createMetaDataUrl } from '@/utils/upload';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAccount } from '../account';

export const useSignToken = () => {
  const { updateSigner, proofOfUs, background, hasSigned, updateProofOfUs } =
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

    const tokenId = await getTokenId(
      process.env.NEXT_PUBLIC_CONNECTION_EVENTID ?? '',
      manifestData.url,
    );
    return {
      transaction: transaction,
      manifestUri: manifestData?.url,
      imageUri: imageData.url,
      tokenId,
    };
  };

  const sign = async () => {
    const transaction = searchParams.get('transaction');

    if (!transaction || hasSigned()) return;

    await updateProofOfUs({
      tx: transaction,
      signees: updateSigner({ signerStatus: 'success' }, true),
    });

    setIsLoading(false);
    setHasError(false);

    router.replace(getReturnUrl());
  };

  useEffect(() => {
    sign();
  }, [searchParams]);

  const signToken = async () => {
    if (!proofOfUs || !account) return;
    setIsLoading(true);
    setHasError(false);

    let transaction = proofOfUs.tx;
    if (!transaction) {
      const transactionData = await createTx();
      if (!transactionData) return;

      transaction = Buffer.from(
        JSON.stringify(transactionData.transaction),
      ).toString('base64');

      await updateProofOfUs({
        requestKey: transactionData.transaction?.hash,
        tokenId: transactionData.tokenId,
        manifestUri: transactionData.manifestUri,
        imageUri: transactionData.imageUri,
        signees: updateSigner({ signerStatus: 'signing' }, true),
      });
    } else {
      await updateProofOfUs({
        signees: updateSigner({ signerStatus: 'signing' }, true),
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
