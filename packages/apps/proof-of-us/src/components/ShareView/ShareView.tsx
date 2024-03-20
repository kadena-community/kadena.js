import { Button } from '@/components/Button/Button';
import { ListSignees } from '@/components/ListSignees/ListSignees';
import { useSignToken } from '@/hooks/data/signToken';
import { useProofOfUs } from '@/hooks/proofOfUs';
import { getReturnHostUrl } from '@/utils/getReturnUrl';
import { isAlreadySigning, isSignedOnce } from '@/utils/isAlreadySigning';
import {
  MonoArrowBack,
  MonoArrowDownward,
  MonoCheckCircle,
} from '@kadena/react-icons';
import { Stack } from '@kadena/react-ui';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { QRCode } from 'react-qrcode-logo';
import { IconButton } from '../IconButton/IconButton';
import { ImagePositions } from '../ImagePositions/ImagePositions';
import { TitleHeader } from '../TitleHeader/TitleHeader';

import { useAccount } from '@/hooks/account';
import { ScreenHeight } from '../ScreenHeight/ScreenHeight';
import { copyClass, qrClass } from './style.css';

interface IProps {
  next: () => void;
  prev: () => void;
  status: number;
}

export const ShareView: FC<IProps> = ({ prev, status }) => {
  const qrRef = useRef<QRCode | null>(null);
  const qrContainerRef = useRef<HTMLDivElement>(null);

  const [isMounted, setIsMounted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { proofOfUs, isInitiator } = useProofOfUs();
  const { account } = useAccount();
  const { signToken } = useSignToken();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleBack = () => {
    prev();
  };

  const handleSign = async () => {
    if (!proofOfUs) return;

    signToken();

    return;
  };

  //check that the account is also really the initiator.
  //other accounts have no business here and are probably looking for the scan view
  useEffect(() => {
    if (!isInitiator()) {
      router.replace(`/scan/${proofOfUs?.proofOfUsId}`);
      return;
    }
    setIsMounted(true);
  }, [proofOfUs, account]);

  useEffect(() => {
    const transaction = searchParams.get('transaction');
    if (!transaction || !proofOfUs) return;
  }, []);

  useEffect(() => {
    if (!isCopied) return;

    const timer = setTimeout(() => {
      setIsCopied(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isCopied]);

  if (!proofOfUs || !account || !isMounted) return;

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${getReturnHostUrl()}/scan/${proofOfUs.proofOfUsId}`,
    );
    setIsCopied(true);
  };

  return (
    <ScreenHeight>
      {status === 3 && (
        <>
          <TitleHeader
            Prepend={() => (
              <>
                {!isAlreadySigning(proofOfUs.signees) && (
                  <IconButton onClick={handleBack}>
                    <MonoArrowBack />
                  </IconButton>
                )}
              </>
            )}
            label="Share"
            Append={() => (
              <>
                {isCopied ? (
                  <Stack>
                    Copied <MonoCheckCircle className={copyClass} />
                  </Stack>
                ) : null}
              </>
            )}
          />

          {!isAlreadySigning(proofOfUs.signees) ? (
            <>
              <div
                className={qrClass}
                ref={qrContainerRef}
                onClick={handleCopy}
              >
                <QRCode
                  ecLevel="H"
                  size={300}
                  ref={qrRef}
                  value={`${getReturnHostUrl()}/scan/${proofOfUs.proofOfUsId}`}
                  removeQrCodeBehindLogo={true}
                  logoImage="/assets/qrlogo.png"
                  logoPadding={5}
                  quietZone={10}
                  eyeRadius={10}
                />
              </div>
              <Button onPress={handleCopy}>Click to copy link</Button>
              <ListSignees />
            </>
          ) : (
            <>
              <ImagePositions />
              <ListSignees />
            </>
          )}
          {isSignedOnce(proofOfUs.signees) && (
            <Button onPress={handleSign}>Sign & Upload</Button>
          )}
        </>
      )}
      {status === 4 && (
        <>
          <TitleHeader
            Prepend={() => (
              <>
                <button onClick={handleBack}>
                  <MonoArrowDownward />
                </button>
              </>
            )}
            label="Sign & Upload Proof"
          />

          <div>status: {proofOfUs.mintStatus}</div>
          <ListSignees />

          {proofOfUs.mintStatus === 'success' && (
            <div>
              <Link href="/user">dashboard</Link>
              <Link href={`/user/proof-of-us/${proofOfUs?.tokenId}`}>
                go to proof
              </Link>
            </div>
          )}
        </>
      )}
    </ScreenHeight>
  );
};
