import { useProofOfUs } from '@/hooks/proofOfUs';
import { createManifest } from '@/utils/createManifest';
import { env } from '@/utils/env';
import { getReturnHostUrl, getReturnUrl } from '@/utils/getReturnUrl';
import { createConnectTokenTransaction, getTokenId } from '@/utils/proofOfUs';
import { createImageUrl, createMetaDataUrl } from '@/utils/upload';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAccount } from '../account';

export const useSignToken = () => {
  const {
    updateSignee,
    proofOfUs,
    signees = [],
    background,
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

  const searchParams = useSearchParams();
  const transaction = searchParams.get('transaction');

  const createTx = async () => {
    if (!proofOfUs || !account) return;

    const imageData = await createImageUrl(background.bg);
    if (!imageData) {
      console.error('no image found');
      return;
    }
    const manifest = await createManifest(proofOfUs, signees, imageData.url);
    const manifestData = await createMetaDataUrl(manifest);
    if (!manifestData) {
      console.error('no manifestData found');
      return;
    }

    const transaction = await createConnectTokenTransaction(
      manifestData?.url,
      signees,
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
      eventName: manifest.properties.eventName,
      tokenId,
    };
  };

  const sign = async () => {
    const signed = await hasSigned();

    console.log('test', { signed, transaction });
    if (!transaction || signed || !proofOfUs) return;
    const tx = JSON.parse(Buffer.from(transaction, 'base64').toString());

    console.log('test', { tx });

    console.log('test', 'signing success');
    const signature = await getSignature(tx);
    console.log('test', { signature });
    await updateSignee({ signerStatus: 'success', signature }, true);

    console.log('update in signtoken sign');
    const accountIsInitiator = await isInitiator();
    await updateProofOfUs({
      tx: transaction,
      status: accountIsInitiator ? 4 : 3,
    });

    setIsLoading(false);
    setHasError(false);

    //when the account is not the initiator you want to redirect.
    //if they are the initiator, you dont, so the app will submit the nft
    if (accountIsInitiator) return;

    router.replace(
      `${getReturnHostUrl()}/user/proof-of-us/t/${proofOfUs.tokenId}/${
        tx.hash
      }`,
    );
  };

  useEffect(() => {
    if (!proofOfUs) return;
    sign();
  }, [searchParams, transaction, proofOfUs]);

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

      console.log('update in signtoken signtoken');
      await updateSignee({ signerStatus: 'signing' }, true);
      await updateProofOfUs({
        requestKey: transactionData.transaction?.hash,
        tokenId: transactionData.tokenId,
        manifestUri: transactionData.manifestUri,
        imageUri: transactionData.imageUri,
        eventName: transactionData.eventName,
      });
    } else {
      console.log('update in signtoken else');
      await updateSignee({ signerStatus: 'signing' }, true);
    }

    router.push(
      `${
        process.env.NEXT_PUBLIC_WALLET_URL
      }/sign?transaction=${transaction}&chainId=${
        env.CHAINID
      }&returnUrl=${getReturnUrl()}
      `,
    );
  };

  return { isLoading, hasError, data, signToken };
};
