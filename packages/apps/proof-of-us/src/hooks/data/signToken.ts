import { useProofOfUs } from '@/hooks/proofOfUs';
import { createManifest } from '@/utils/createManifest';
import { createConnectTokenTransaction } from '@/utils/proofOfUs';
import { createImageUrl, createMetaDataUrl } from '@/utils/upload';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAccount } from '../account';

export const useSignToken = () => {
  const { updateSigner, proofOfUs, background, addTx } = useProofOfUs();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [data] = useState<IProofOfUs | undefined>(undefined);
  const { id } = useParams();
  const { account } = useAccount();
  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    const transaction = searchParams.get('transaction');
    if (!transaction) return;

    addTx(transaction);
    updateSigner({ signerStatus: 'success' }, true);

    setIsLoading(false);
    setHasError(false);
    //router.replace(`/scan/${id}`);
  }, [searchParams]);

  const signToken = async () => {
    if (!proofOfUs || !account) return;
    setIsLoading(true);
    setHasError(false);

    updateSigner({ signerStatus: 'signing' }, true);

    const imageData = await createImageUrl(background.bg);
    if (!imageData) {
      console.error('no image found');
      return;
    }
    const manifest = createManifest(proofOfUs, imageData.url);
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

    console.log(4444, transaction);

    router.push(
      `${process.env.NEXT_PUBLIC_WALLET_URL}/sign?transaction=${Buffer.from(
        JSON.stringify(transaction),
      ).toString('base64')}&returnUrl=${process.env.NEXT_PUBLIC_URL}/scan/${id}
      `,
    );
  };

  return { isLoading, hasError, data, signToken };
};
